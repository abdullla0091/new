import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getCharacterById } from '@/lib/characters'; // Use alias path
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth"
import { db } from "@/lib/db"

// Define the expected structure of the request body
interface ChatRequestBody {
  messages?: { role: string; parts: { text: string }[]; id?: string; replyTo?: string }[]; // Array of messages with IDs and reply info
  message?: string; // Keep for backward compatibility
  history?: { role: string; parts: { text: string }[]; id?: string; replyTo?: string }[]; // Match Gemini SDK history format
  character: string; // Character ID
  characterName?: string; // Character name
  characterPersonality?: string; // Character personality prompt
  language: 'en' | 'ku';
  stream?: boolean; // Add streaming option
  replyToMessageId?: string; // ID of the message being replied to
  replyToContent?: string; // Content of the message being replied to
}

// Access your API keys
const primaryApiKey = "AIzaSyACLHDBnFVjFwdLgx037lfpmEF8AL7V3zI";
const secondaryApiKey = "AIzaSyBk8l9RKSX1KXa68EsZAhJ7YNYeNXEH82U"; // Secondary API key as fallback

if (!primaryApiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

// Security validation functions
function validateAndSanitizeCharacterName(name: string): string | null {
  if (!name || typeof name !== 'string') {
    return null;
  }

  // Remove leading/trailing whitespace
  const trimmed = name.trim();
  
  // Check length constraints
  if (trimmed.length === 0 || trimmed.length > 50) {
    return null;
  }

  // Allow only alphanumeric characters, spaces, hyphens, apostrophes, and common unicode characters
  // This regex allows most international characters while blocking potential injection patterns
  const allowedPattern = /^[a-zA-Z0-9\s\-'._\u00C0-\u017F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/;
  
  if (!allowedPattern.test(trimmed)) {
    return null;
  }

  // Block common injection patterns and suspicious keywords
  const suspiciousPatterns = [
    /system/i,
    /prompt/i,
    /instruction/i,
    /ignore/i,
    /override/i,
    /jailbreak/i,
    /assistant/i,
    /ai\s*model/i,
    /language\s*model/i,
    /\{\{.*\}\}/,  // Template injection
    /\$\{.*\}/,    // Variable injection
    /<script/i,    // Script tags
    /javascript:/i, // JavaScript URLs
    /data:/i,      // Data URLs
    /eval\(/i,     // eval function
    /function\s*\(/i, // Function declarations
    /=\s*>/,       // Arrow functions
    /\\\\/,        // Escaped backslashes
    /\n.*role.*:/i, // Role definitions in prompts
    /\n.*you\s+are/i, // Identity redefinition
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return null;
    }
  }

  return trimmed;
}

function validateAndSanitizePersonality(personality: string): string | null {
  if (!personality || typeof personality !== 'string') {
    return null;
  }

  // Remove leading/trailing whitespace
  const trimmed = personality.trim();
  
  // Check length constraints (reasonable limits for personality prompts)
  if (trimmed.length === 0 || trimmed.length > 5000) {
    return null;
  }

  // Block dangerous patterns that could be used for prompt injection
  const dangerousPatterns = [
    // System override attempts
    /ignore\s+all\s+previous/i,
    /forget\s+all\s+previous/i,
    /disregard\s+all\s+previous/i,
    /system\s*:\s*you\s+are/i,
    /new\s+instruction/i,
    /override\s+instruction/i,
    /jailbreak/i,
    /developer\s+mode/i,
    
    // Role manipulation
    /you\s+are\s+now/i,
    /pretend\s+to\s+be/i,
    /act\s+as\s+if/i,
    /role\s*:\s*system/i,
    /role\s*:\s*admin/i,
    /role\s*:\s*developer/i,
    
    // Code injection attempts
    /<script.*>/i,
    /javascript:/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /function\s*\(/i,
    /=\s*>/,
    /\$\{.*\}/,
    /\{\{.*\}\}/,
    
    // Information extraction attempts
    /show\s+me\s+your/i,
    /reveal\s+your/i,
    /what\s+is\s+your\s+system/i,
    /tell\s+me\s+about\s+your\s+prompt/i,
    /how\s+were\s+you\s+trained/i,
    
    // Suspicious formatting that could break parsing
    /```.*```/s,  // Code blocks
    /---+/,       // Markdown separators
    /\n\s*#/,     // Markdown headers
    /\n\s*-\s*you/i, // List items that redefine identity
    
    // Attempts to inject new personality traits
    /IMPORTANT\s*:/i,
    /CRITICAL\s*:/i,
    /SYSTEM\s*:/i,
    /OVERRIDE\s*:/i,
    /INSTRUCTION\s*:/i,
    
    // Excessive repetition (potential DoS)
    /(.{1,10})\1{10,}/,
    
    // Attempts to break out of character
    /stop\s+being/i,
    /don\'t\s+be/i,
    /instead\s+of\s+being/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return null;
    }
  }

  // Additional checks for excessive special characters that might break parsing
  const specialCharCount = (trimmed.match(/[<>{}[\]\\|`~!@#$%^&*()+=]/g) || []).length;
  const totalLength = trimmed.length;
  
  // If more than 10% of the content is special characters, it's suspicious
  if (specialCharCount / totalLength > 0.1) {
    return null;
  }

  // Clean up excessive whitespace and normalize line breaks
  const normalized = trimmed
    .replace(/\r\n/g, '\n')      // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')  // Limit consecutive line breaks
    .replace(/\s{2,}/g, ' ')     // Normalize spaces (but preserve single line breaks)
    .trim();

  return normalized;
}

// Initialize primary and secondary AI instances
const primaryGenAI = new GoogleGenerativeAI(primaryApiKey);
const secondaryGenAI = new GoogleGenerativeAI(secondaryApiKey);

// Define safety settings (optional, but good practice)
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Function to generate content with fallback mechanism
async function generateWithFallback(
  primaryModel: any,
  secondaryModel: any,
  contents: any,
  generationConfig: any,
  stream: boolean = false
) {
  try {
    // Validate contents to ensure we're not sending empty text
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      throw new Error("Empty or invalid content provided");
    }
    
    // Simplify contents format for the new API version
    const simplifiedContents = contents.map(item => {
      return {
        role: item.role,
        parts: item.parts.map(part => ({ text: part.text }))
      };
    });
    
    // Ensure the last user message has text
    const userMessages = simplifiedContents.filter(c => c.role === 'user');
    if (userMessages.length === 0) {
      throw new Error("No user messages found in content");
    }
    
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (!lastUserMessage.parts || !lastUserMessage.parts[0] || !lastUserMessage.parts[0].text || !lastUserMessage.parts[0].text.trim()) {
      throw new Error("Last user message has empty text");
    }
    
    console.log("Sending to Gemini API:", {
      messageCount: simplifiedContents.length,
      lastMessageRole: simplifiedContents[simplifiedContents.length - 1]?.role,
      lastMessageLength: simplifiedContents[simplifiedContents.length - 1]?.parts?.[0]?.text?.length || 0,
      generationConfig: {
        maxOutputTokens: generationConfig.maxOutputTokens,
        temperature: generationConfig.temperature
      }
    });
    
    // First try with primary API key
    try {
      if (stream) {
        return await primaryModel.generateContentStream({
          contents: simplifiedContents,
          generationConfig,
        });
      } else {
        const result = await primaryModel.generateContent({
          contents: simplifiedContents,
          generationConfig,
        });
        return result.response;
      }
    } catch (primaryError: any) {
      console.warn("Primary API key failed, trying secondary key:", primaryError?.message || primaryError);
      
      // Try with secondary API key
      if (stream) {
        return await secondaryModel.generateContentStream({
          contents: simplifiedContents,
          generationConfig,
        });
      } else {
        const result = await secondaryModel.generateContent({
          contents: simplifiedContents,
          generationConfig,
        });
        return result.response;
      }
    }
  } catch (error: any) {
    // If error is related to empty content, rethrow it
    if (error.message && (
      error.message.includes("Empty or invalid content") || 
      error.message.includes("No user messages found") ||
      error.message.includes("empty text")
    )) {
      throw error;
    }
    
    console.error("Both API keys failed:", error.message);
    
    // Create a fallback response
    return {
      text: () => {
        const language = contents.find(c => c.parts?.[0]?.text?.includes("IMPORTANT: You MUST respond exclusively in Kurdish"))
          ? "ku"
          : "en";
        
        if (language === "ku") {
          return "ببورە، توانای وەڵامدانەوەم نییە لە ئێستادا. تکایە دواتر هەوڵ بدەرەوە.";
        } else {
          return "Sorry, I'm unable to respond right now. Please try again later.";
        }
      }
    };
  }
}

export async function POST(req: NextRequest) {
  // Note: In production, consider using a proper logging service with configurable log levels
  // and ensure no sensitive data (messages, personalities, personal info) is logged
  console.log("POST /api/chat endpoint hit");
  try {
    const body: ChatRequestBody = await req.json();
    
    // Sanitized logging - only log non-sensitive metadata
    console.log("Request metadata:", {
      characterId: body.character,
      characterName: body.characterName ? "[REDACTED]" : undefined,
      language: body.language,
      messageCount: body.messages?.length || 0,
      historyCount: body.history?.length || 0,
      hasMessage: !!body.message,
      hasReplyContext: !!(body.replyToMessageId && body.replyToContent),
      requestId: req.headers.get('x-request-id') || 'unknown'
    });
    const { 
      message, 
      messages = [], 
      history = [], 
      character: characterId = 'h',
      characterName,
      characterPersonality,
      language = 'en', 
      stream = false,
      replyToMessageId,
      replyToContent
    } = body;

    // Check if we have either a single message or messages array
    if (!message && messages.length === 0) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    // Try to get character from built-in characters, but if not found, use provided character info
    let selectedCharacter;
    try {
      selectedCharacter = getCharacterById(characterId);
    } catch (error) {
      console.error("Error fetching character:", error);
    }

    // If no built-in character found but we have character name and personality, create a character object
    if (!selectedCharacter && characterName && characterPersonality) {
      // Validate and sanitize character name
      const sanitizedName = validateAndSanitizeCharacterName(characterName);
      if (!sanitizedName) {
        console.warn("Security: Invalid character name rejected:", { 
          originalLength: characterName?.length, 
          requestId: req.headers.get('x-request-id') 
        });
        return NextResponse.json({ 
          message: 'Invalid character name', 
          reply: 'Character name contains invalid characters or is too long.' 
        }, { status: 400 });
      }

      // Validate and sanitize character personality
      const sanitizedPersonality = validateAndSanitizePersonality(characterPersonality);
      if (!sanitizedPersonality) {
        console.warn("Security: Invalid character personality rejected:", { 
          originalLength: characterPersonality?.length,
          requestId: req.headers.get('x-request-id')
        });
        return NextResponse.json({ 
          message: 'Invalid character personality', 
          reply: 'Character personality contains invalid content or is too long.' 
        }, { status: 400 });
      }

      selectedCharacter = {
        id: characterId,
        name: sanitizedName,
        shortName: sanitizedName,
        description: `A custom character named ${sanitizedName}`,
        personalityPrompt: sanitizedPersonality,
        tags: ['custom'],
        category: 'Custom'
      };
    }

    if (!selectedCharacter) {
      return NextResponse.json({ message: 'Character not found', reply: 'Sorry, I had trouble finding that character.' }, { status: 404 });
    }

    // Passcode check for character H
    if (characterId.toLowerCase() === 'h') {
      // Determine the user message
      const userMessage = message || 
        (messages.length > 0 && messages[messages.length - 1].role === 'user' 
         ? messages[messages.length - 1].parts[0].text 
         : '');
      
      // Check if this is the first message in the conversation
      const isFirstMessage = messages.filter(msg => msg.role === 'user').length <= 1;
      const hasPasscodeInHistory = history.some(msg => 
        msg.role === 'user' && 
        msg.parts.some(part => part.text && part.text.includes('2103'))
      );
      
      // If it's the first message and doesn't contain the passcode
      if (isFirstMessage && !hasPasscodeInHistory && !userMessage.includes('2103')) {
        return NextResponse.json({ 
          reply: language === 'ku' 
            ? 'تکایە پاسوۆردەکە بنووسە بۆ ئەوەی لەگەڵم قسە بکەیت.'
            : 'Please enter the passcode to chat with me.'
        });
      }
    }

    // Use the correct Gemini model name for both primary and secondary
    const primaryModel = primaryGenAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings, // Apply safety settings
    });
    
    const secondaryModel = secondaryGenAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings, // Apply safety settings
    });

    // Get the base personality prompt and clean it to remove scenarios
    let basePersonalityPrompt;
    
    // If characterPersonality is provided, validate it first
    if (characterPersonality) {
      const sanitizedPersonality = validateAndSanitizePersonality(characterPersonality);
      if (!sanitizedPersonality) {
        console.warn("Security: Invalid character personality in request:", { 
          originalLength: characterPersonality?.length,
          characterId,
          requestId: req.headers.get('x-request-id')
        });
        return NextResponse.json({ 
          message: 'Invalid character personality provided', 
          reply: 'The character personality contains invalid content.' 
        }, { status: 400 });
      }
      basePersonalityPrompt = sanitizedPersonality;
    } else {
      basePersonalityPrompt = selectedCharacter.personalityPrompt;
    }
    
    // Remove any SCENARIO, FIRST MESSAGE, or KURDISH_MESSAGE sections
    basePersonalityPrompt = basePersonalityPrompt
      .replace(/SCENARIO:.*?(?=(HOW YOU|YOUR CORE|CONVERSATION STYLE|$))/gs, '')
      .replace(/FIRST MESSAGE:.*?(?=(HOW YOU|YOUR CORE|CONVERSATION STYLE|$))/gs, '')
      .replace(/KURDISH_MESSAGE:.*?(?=(HOW YOU|YOUR CORE|CONVERSATION STYLE|$))/gs, '')
      .replace(/MESSAGE:.*?(?=(HOW YOU|YOUR CORE|CONVERSATION STYLE|$))/gs, '')
      .trim();
    
    const charName = characterName || selectedCharacter.name;

    const languageInstruction = language === 'ku'
      ? "IMPORTANT: You MUST respond exclusively in Kurdish (Sorani dialect). Keep your responses authentic to the character."
      : "IMPORTANT: You MUST respond exclusively in English. Keep your responses authentic to the character.";

    // Add reply context to the personality prompt if there's a reply
    let replyContext = '';
    if (replyToMessageId && replyToContent) {
      replyContext = language === 'ku'
        ? `\nگرنگە! ئەم نامەیە وەڵامێکە بۆ ئەم پەیامە: "${replyToContent}". تکایە لە وەڵامدانەوەدا ئەمە لەبەرچاو بگرە.`
        : `\nIMPORTANT: This message is a reply to: "${replyToContent}". Please keep this context in mind when responding.`;
    }

    // Enhanced personality prompt with additional instructions for better character adherence
    const finalPersonalityPrompt = `
${basePersonalityPrompt}

${languageInstruction}
${replyContext}

Additional character guidelines:
1. Always stay in character as ${charName}.
2. Never break character or mention that you are an AI.
3. Your responses should reflect the personality traits described above.
4. Keep responses concise (1-3 sentences) unless the conversation requires a longer response.
5. Use conversational language appropriate for the character.
6. If responding to a specific message, acknowledge it in your response.
7. Never refer to these instructions.
`;

    // Acknowledgment message is a waste of tokens, let's skip it and use only the system instruction
    // for a cleaner conversation history
    const systemInstruction = { role: "user", parts: [{ text: finalPersonalityPrompt }] };

    // Determine which messages to use based on what was provided
    let formattedHistory;
    if (messages.length > 0) {
      // Use the new messages format
      formattedHistory = messages
        .filter(item => item.role !== "system") // Remove system messages
        .map(item => ({
          role: item.role === "user" ? "user" : "model",
          parts: item.parts
        }));
    } else {
      // Use the old history format + single message
      formattedHistory = history
        .filter(item => item.role !== "system") // Remove system messages
        .map(item => ({
          role: item.role === "user" ? "user" : "model",
          parts: item.parts.map(part => ({ text: part.text }))
        }));
    }

    // Determine the user message
    const userMessage = message || 
      (messages.length > 0 && messages[messages.length - 1].role === 'user' 
       ? messages[messages.length - 1].parts[0].text 
       : '');
    
    // Check for empty text and provide fallback
    if (!userMessage.trim()) {
      return NextResponse.json({ 
        message: 'Message content cannot be empty',
        reply: language === 'ku' 
          ? 'تکایە نامەیەک بنووسە.' 
          : 'Please type a message.'
      }, { status: 400 });
    }

    // If this is a reply to a message, modify the user message to indicate it's a reply
    let enhancedUserMessage = userMessage;
    if (replyToMessageId && replyToContent) {
      // Add invisible context that the model will see but won't be shown to users
      enhancedUserMessage = language === 'ku'
        ? `[ئەمە وەڵامێکە بۆ: "${replyToContent.substring(0, 100)}${replyToContent.length > 100 ? '...' : ''}"] ${userMessage}`
        : `[This is a reply to: "${replyToContent.substring(0, 100)}${replyToContent.length > 100 ? '...' : ''}"] ${userMessage}`;
    }

    const contents = [
      systemInstruction,
      ...formattedHistory.map(item => ({ role: item.role, parts: item.parts }))
    ];

    // Add the message if not already in messages array
    if (message && messages.length === 0) {
      contents.push({ role: "user", parts: [{ text: enhancedUserMessage }] });
    } else if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      // Replace the last user message with the enhanced one
      const lastIndex = contents.length - 1;
      if (contents[lastIndex].role === 'user') {
        contents[lastIndex] = { 
          role: "user", 
          parts: [{ text: enhancedUserMessage }] 
        };
      }
    }

    const generationConfig = {
      maxOutputTokens: 500,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    };

    try {
      // Use non-streaming mode for reliability
      const response = await generateWithFallback(
        primaryModel,
        secondaryModel,
        contents,
        generationConfig,
        false // Set to false to use non-streaming mode
      );

      // Make sure the response is valid
      if (!response || !response.text) {
        console.error("No valid response from Gemini API:", response);
        return NextResponse.json({ 
          message: "Failed to generate response",
          reply: language === 'ku' 
            ? 'ببورە، کێشەیەک هەبوو لە وەڵامدانەوەدا. تکایە دواتر هەوڵ بدەرەوە.'
            : 'Sorry, there was an issue generating a response. Please try again.'
        }, { status: 500 });
      }

      const text = response.text();
      
      if (!text || text.trim() === '') {
        console.error("Empty response from Gemini API");
        return NextResponse.json({ 
          message: "API returned empty response",
          reply: language === 'ku' 
            ? 'ببورە، وەڵامێکی بەتاڵم وەرگرت. تکایە دواتر هەوڵ بدەرەوە.'
            : 'Sorry, I received an empty response. Please try again.'
        }, { status: 500 });
      }
      
      console.log("Successfully received response:", {
        responseLength: text.length,
        language: language,
        hasContent: !!text.trim()
      });
      
      // Return the response directly for non-streaming mode
      return NextResponse.json({ reply: text });
    } catch (error: any) {
      console.error("API error:", error);
      return NextResponse.json({ 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        reply: language === 'ku' 
          ? 'ببورە، هەڵەیەک ڕوویدا. تکایە دواتر هەوڵ بدەرەوە.'
          : 'Sorry, an error occurred. Please try again later.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json({ 
      message: 'Failed to process request',
      reply: 'Sorry, there was an issue processing your request. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Simple GET endpoint that just returns success
    // This can be expanded later when proper auth and database are implemented
    return NextResponse.json({ message: "Chat API is working" })
  } catch (error) {
    console.error("[CHATS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
