import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getCharacterById } from '@/lib/characters'; // Use alias path
import { NextRequest, NextResponse } from 'next/server';
// Import auth but don't use it directly yet - we'll check its type
import * as authModule from "@/auth";
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
    
    console.log("Sending to Gemini API:", JSON.stringify({ 
      contentSample: simplifiedContents.slice(-2), // Only log last couple messages for brevity
      generationConfig 
    }));
    
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
    } catch (primaryError) {
      console.warn("Primary API key failed, trying secondary key:", primaryError.message);
      
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
  try {
    // Safely handle auth regardless of what form it takes (object or function)
    let userName = "User";
    
    try {
      const auth = authModule.auth;
      if (typeof auth === 'function') {
        try {
          // If auth is a function, try to call it
          const session = await auth();
          userName = session?.user?.name || session?.user?.email?.split('@')[0] || "User";
        } catch (e) {
          console.log("Auth function error:", e);
          // Continue with default username
        }
      } else if (auth && typeof auth === 'object' && typeof auth.isAuthenticated === 'function') {
        // If auth is an object with isAuthenticated method
        const isAuthenticated = auth.isAuthenticated();
        userName = isAuthenticated ? "User" : "Guest";
      }
    } catch (authError) {
      console.error("Auth error:", authError);
      // Continue with default username if auth fails
    }
    
    const body: ChatRequestBody = await req.json();
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

    let selectedCharacter;
    try {
      selectedCharacter = getCharacterById(characterId);
    } catch (error) {
      console.error("Error fetching character:", error);
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
    let basePersonalityPrompt = characterPersonality || selectedCharacter.personalityPrompt;
    
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

${userName ? `USER INFORMATION: The user's name is "${userName}". Address them by name when appropriate and build a personal connection.` : ''}

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
      
      console.log("Successfully received response:", text.substring(0, 100) + "...");
      
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
    const session = await authModule.auth()
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const chats = await db.chat.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        character: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    })
    
    return NextResponse.json(chats)
  } catch (error) {
    console.error("[CHATS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
