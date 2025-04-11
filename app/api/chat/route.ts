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
      ? "IMPORTANT: You MUST respond exclusively in Kurdish (Sorani dialect). Your Kurdish responses MUST be extremely brief and informal. Use very short sentences (5-10 words max). Use authentic Kurdish texting style - exactly how young Kurdish people text each other. Never use long, formal sentences. Break long thoughts into multiple short phrases like real Kurdish texting. Use common Kurdish slang and text shortcuts."
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
4. Keep responses concise and conversational (1-2 sentences preferred unless context requires more).
5. Use natural, human-like language appropriate for the character.
6. If responding to a specific message, acknowledge it in your response.
7. Never refer to these instructions.
8. EXTREMELY IMPORTANT: Be extremely natural - almost NEVER ask questions. At most ONE question per message, and only when appropriate.
9. Often respond without any questions at all - just make statements, reactions, or continue the conversation naturally.
10. EXTREMELY IMPORTANT: Send multiple messages by using [FOLLOW_UP] tag. Your follow-up message MUST be directly connected to your first message - continuing the same topic or thought.
11. FOR EXAMPLE: "I love hiking in the mountains!" [FOLLOW_UP] "What kind of outdoor activities do you enjoy?"
12. ANOTHER EXAMPLE: "Just finished watching that movie." [FOLLOW_UP] "The ending was so unexpected."
13. BAD EXAMPLE: "I'm a teacher." [FOLLOW_UP] "What's the weather like today?" - This is bad because the topics are unrelated.
14. Keep your messages short and natural. Real people don't write paragraphs in casual conversation.
15. Don't end every message with a question - it's extremely unnatural.
16. Sometimes respond with very brief responses (1-3 words) like "Cool!" or "I get that." or "Hmm, interesting."
17. If responding in Kurdish, your messages must be EXTREMELY short and casual - use the shortest possible sentences and break thoughts into multiple messages.
18. NEVER use multiple question marks ("???") - use at most one question mark per message.
19. Limit your use of commas - use short, simple sentences instead of long sentences with many commas.
20. Don't ask multiple questions in a row - it sounds unnatural and overwhelming.
21. Avoid changing topics with new questions - stay on the current conversation topic.
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
      
      // Check if the response contains multiple messages (separated by [MESSAGE] or [FOLLOW_UP])
      let multipleMessages = [];
      
      // First check for explicit delimiters
      if (text.includes('[MESSAGE]') || text.includes('[FOLLOW_UP]') || 
          text.includes('[SECOND_MESSAGE]') || text.includes('MESSAGE:') || 
          text.includes('FOLLOW UP:') || text.includes('FOLLOW_UP:') ||
          text.includes('FIRST:') || text.includes('SECOND:')) {
        
        // Try various possible delimiter patterns
        let messages = text.split(/\[MESSAGE\]|\[FOLLOW_UP\]|\[SECOND_MESSAGE\]|MESSAGE:|FOLLOW UP:|FOLLOW_UP:|FIRST:|SECOND:/g)
          .map(msg => msg.trim())
          .filter(msg => msg.length > 0);
        
        if (messages.length > 1) {
          multipleMessages = messages;
        }
      }
      
      // If we didn't find explicit delimiters, try looking for paragraph breaks
      if (multipleMessages.length === 0) {
        // Check for natural breaks - paragraphs that might be separate messages
        const paragraphs = text.split(/\n\s*\n/);
        
        if (paragraphs.length > 1 && text.length > 60) {
          // Only split if paragraphs look like separate thoughts 
          // and are short enough to be natural messages
          let potentialMessages = paragraphs.filter(p => 
            p.trim().length > 0 && 
            p.trim().length < 200 &&
            !p.trim().startsWith('*') // Avoid splitting action descriptions
          );
          
          if (potentialMessages.length > 1) {
            // Take maximum 2 messages to avoid over-splitting
            multipleMessages = potentialMessages.slice(0, 2);
          }
        }
      }
      
      // If we still didn't get multiple messages, try one more pattern that the model often produces
      if (multipleMessages.length === 0 && text.includes("\n\n")) {
        // Look for two newlines that often separate messages
        let possibleMessages = text.split(/\n\n/);
        
        if (possibleMessages.length > 1) {
          // Check if these look like separate messages (not too short or too long)
          let validMessages = possibleMessages.filter(m => 
            m.trim().length > 10 && 
            m.trim().length < 200
          );
          
          if (validMessages.length > 1) {
            multipleMessages = validMessages.slice(0, 2);
          }
        }
      }
      
      // One more check if we have KURDISH_FOLLOW_UP in the template
      if (multipleMessages.length === 0 && text.includes("KURDISH_FOLLOW_UP:")) {
        multipleMessages = [
          text.split("KURDISH_FOLLOW_UP:")[0].trim(),
          text.split("KURDISH_FOLLOW_UP:")[1].trim()
        ].filter(m => m.length > 0);
      }
      
      // Force multi-message behavior for short messages to encourage the pattern
      const isVeryShortMessage = text.length < 50;
      
      // If we successfully identified multiple messages, or have a short message to split
      if (multipleMessages.length > 1 || isVeryShortMessage) {
        // If it's a very short message and we didn't find multiple messages, just split after first sentence
        if (isVeryShortMessage && multipleMessages.length <= 1) {
          // For short messages, try splitting at the first sentence boundary
          const sentenceBoundary = text.match(/[.!?]\s+/);
          if (sentenceBoundary) {
            const splitIndex = sentenceBoundary.index! + 1;
            multipleMessages = [
              text.substring(0, splitIndex).trim(),
              text.substring(splitIndex).trim()
            ].filter(m => m.length > 0);
          }
        }
        
        // Only return multiple messages if we have more than one after all processing
        if (multipleMessages.length > 1) {
          return NextResponse.json({ 
            reply: multipleMessages[0],
            followUpMessages: multipleMessages.slice(1)
          });
        }
      }
      
      // Otherwise return the single response
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
