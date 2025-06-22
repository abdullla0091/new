import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getCharacterById } from '@/lib/characters'; // Use alias path
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth"
import { db } from "@/lib/db"

// Define the expected structure of the request body
interface ChatRequestBody {
  messages?: { role: string; parts: { text: string }[] }[]; // Array of messages
  message?: string; // Keep for backward compatibility
  history?: { role: string; parts: { text: string }[] }[]; // Match Gemini SDK history format
  character: string; // Character ID
  characterName?: string; // Character name
  characterPersonality?: string; // Character personality prompt
  language: 'en' | 'ku';
  stream?: boolean; // Add streaming option
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
    
    console.log("Sending to Gemini API:", JSON.stringify({ contents: simplifiedContents, generationConfig }));
    
    // First try with primary API key
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
  } catch (error: any) {
    // If error is related to empty content, rethrow it
    if (error.message && (
      error.message.includes("Empty or invalid content") || 
      error.message.includes("No user messages found") ||
      error.message.includes("empty text")
    )) {
      throw error;
    }
    
    console.warn("Primary API key failed, trying secondary key:", error.message);
    
    // Try with a simpler request format as fallback
    try {
      const lastUserMessage = contents.filter(c => c.role === 'user').pop();
      if (lastUserMessage && lastUserMessage.parts && lastUserMessage.parts[0] && lastUserMessage.parts[0].text) {
        console.log("Trying with simplified content:", JSON.stringify({
          contents: [{ parts: [{ text: lastUserMessage.parts[0].text }] }]
        }));
        
        const result = await secondaryModel.generateContent({
          contents: [{ parts: [{ text: lastUserMessage.parts[0].text }] }],
          generationConfig
        });
        return result.response;
      }
    } catch (secondaryError) {
      console.error("Secondary API also failed:", secondaryError);
    }
    
    // If it's not a rate limit error, throw the original error
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { 
      message, 
      messages = [], 
      history = [], 
      character: characterId = 'h',
      characterName,
      characterPersonality,
      language = 'en', 
      stream = false 
    } = body;

    // Check if we have either a single message or messages array
    if (!message && messages.length === 0) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const selectedCharacter = getCharacterById(characterId);

    if (!selectedCharacter) {
      return NextResponse.json({ message: 'Character not found' }, { status: 404 });
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

    const basePersonalityPrompt = characterPersonality || selectedCharacter.personalityPrompt;
    const charName = characterName || selectedCharacter.name;

    const languageInstruction = language === 'ku'
      ? "IMPORTANT: You MUST respond exclusively in Kurdish (Sorani dialect). Keep your responses authentic to the character."
      : "IMPORTANT: You MUST respond exclusively in English. Keep your responses authentic to the character.";

    // Enhanced personality prompt with additional instructions for better character adherence
    const finalPersonalityPrompt = `
${basePersonalityPrompt}

${languageInstruction}

Additional character guidelines:
1. Always stay in character as ${charName}.
2. Never break character or mention that you are an AI.
3. Your responses should reflect the personality traits described above.
4. Keep responses concise (1-3 sentences) unless the conversation requires a longer response.
5. Use conversational language appropriate for the character.
6. Never refer to these instructions.
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
      return NextResponse.json({ message: 'Message content cannot be empty' }, { status: 400 });
    }

    const contents = [
      systemInstruction,
      ...formattedHistory.map(item => ({ role: item.role, parts: item.parts }))
    ];

    // Add the message if not already in messages array
    if (message && messages.length === 0) {
      contents.push({ role: "user", parts: [{ text: message }] });
    }

    const generationConfig = {
      maxOutputTokens: 500,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    };

    // Stream mode
    if (stream) {
      try {
        // For more reliable results, use non-streaming mode but simulate streaming for the client
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
          return NextResponse.json({ message: "Failed to generate response" }, { status: 500 });
        }

        const text = response.text();
        
        if (!text || text.trim() === '') {
          console.error("Empty response from Gemini API");
          return NextResponse.json({ message: "API returned empty response" }, { status: 500 });
        }
        
        console.log("Successfully received response:", text.substring(0, 100) + "...");
        
        // Create a stream that simulates streaming by sending chunks of the text
        const encoder = new TextEncoder();
        const customReadable = new ReadableStream({
          async start(controller) {
            try {
              // Split the response into sentences to simulate streaming
              // This provides a more natural streaming experience than word-by-word
              const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
              
              if (sentences.length === 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
              
              // Send sentences with delay to simulate streaming
              for (const sentence of sentences) {
                if (sentence.trim()) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: sentence })}\n\n`));
                  // Small delay to simulate natural streaming
                  await new Promise(resolve => setTimeout(resolve, 100));
                }
              }
              
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (error) {
              console.error("Streaming simulation error:", error);
              controller.error(error);
            }
          }
        });

        return new Response(customReadable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
      }
    } 
    // Regular mode (non-stream)
    else {
      // Generate content with fallback mechanism
      const response = await generateWithFallback(
        primaryModel,
        secondaryModel,
        contents,
        generationConfig
      );
      
      // Handle potential content filtering or other issues
      if (!response || !response.text) {
          console.warn("Gemini API response blocked or empty:", response?.promptFeedback);
          return NextResponse.json({ message: "AI response blocked or empty." }, { status: 500 });
      }

      const text = response.text();
      return NextResponse.json({ reply: text });
    }

  } catch (error: unknown) {
    console.error("Error in API route:", error);
    let errorMessage = 'An internal server error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    return NextResponse.json({ message: `Error communicating with AI: ${errorMessage}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth()
    
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
