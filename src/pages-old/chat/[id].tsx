import Head from "next/head";
import { useRouter } from 'next/router';
import { useState, FormEvent, useRef, useEffect, ChangeEvent } from "react";
import styles from "@/styles/Home.module.css"; // Reuse chat styles
import { characters, getCharacterById } from "@/lib/characters";

// Define specific interfaces for SpeechRecognition
declare global {
  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
  lang: 'en' | 'ku'; // Add language property
}

// Reusable CharacterRadio component (could be moved to a components folder)
const CharacterRadio = ({ id, value, checked, onChange, disabled, label }: {
  id: string;
  value: string; // Use string for value now
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  label: string;
}) => (
  <div className={styles.radioOption}>
    <input
      type="radio"
      id={id}
      name="character"
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query; // Get character ID from URL query parameter

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  // Language state remains local to the chat page
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ku'>('en');
  const [isRecording, setIsRecording] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Find the character data based on the ID from the URL
  const currentCharacter = getCharacterById(id as string);

  // Scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // --- Voice Input Logic ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage === 'ku' ? 'ku-IQ' : 'en-US';

      recognitionRef.current.onstart = () => setIsRecording(true);
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => setMessage(event.results[0][0].transcript);
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') alert("Microphone access denied.");
        setIsRecording(false);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    } else {
      console.warn("Speech Recognition not supported.");
    }
    return () => recognitionRef.current?.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage === 'ku' ? 'ku-IQ' : 'en-US';
    }
  }, [selectedLanguage]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return alert("Speech Recognition not supported.");
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => recognitionRef.current.start())
        .catch(err => {
          console.error("Mic access error:", err);
          alert("Could not access microphone.");
          setIsRecording(false);
        });
    }
  };
  // --- End Voice Input Logic ---

  // Handle character change (navigates to the new character's chat page)
  const handleCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCharacterId = e.target.value;
    router.push(`/chat/${newCharacterId}`);
    // Reset chat history when changing character
    setChatHistory([]);
    setMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || loading || !currentCharacter) return;

    // Store language with the message
    const newMessage: ChatMessage = { role: "user", parts: [{ text: message }], lang: selectedLanguage };
    // Use functional update for state consistency
    setChatHistory(prev => [...prev, newMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: chatHistory, // Send history *before* adding the new user message
          character: currentCharacter.id, // Use current character ID
          language: selectedLanguage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        throw new Error(`API error: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      // Store language with the message (assuming API replies in requested language)
      const botMessage: ChatMessage = { role: "model", parts: [{ text: data.reply }], lang: selectedLanguage };
      // Use functional update to ensure state consistency
      setChatHistory(prev => [...prev, botMessage]);

     } catch (error) {
       console.error("Failed to send message:", error);
       // Type check the error before accessing message property
       let errorText = "An unexpected error occurred.";
       if (error instanceof Error) {
         errorText = `Sorry, error: ${error.message}`;
       } else if (typeof error === 'string') {
         errorText = `Sorry, error: ${error}`;
       }
       // Store language with the error message (default to current selection)
       const errorMessage: ChatMessage = { role: "model", parts: [{ text: errorText }], lang: selectedLanguage };
       setChatHistory(prev => [...prev, errorMessage]);
     } finally {
      setLoading(false);
    }
  };

  // Handle case where character data is not found yet (e.g., during initial load)
  if (!currentCharacter) {
    return <div>Loading character...</div>; // Or a proper loading spinner
  }

  return (
    <>
      <Head>
        {/* Update title dynamically */}
        <title>Chat with {currentCharacter.name}</title>
        <meta name="description" content={`Chat with ${currentCharacter.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Use the same chat layout structure */}
      <main className={styles.chatLayout}>
          <header className={styles.chatHeader}>
            {/* Simplified header for chat page */}
            <h1 className={styles.title}>Chat with {currentCharacter.name}</h1>
             {/* Controls are still useful here */}
             <div className={styles.controlsGroup}>
               {/* Character Selection (now navigates) */}
               <div className={styles.characterSelector}>
                 {characters.map(char => (
                   <CharacterRadio
                     key={char.id}
                     id={`chat-char-${char.id}`}
                     value={char.id} // Use ID for value
                     checked={currentCharacter.id === char.id}
                     onChange={handleCharacterChange}
                     disabled={loading}
                     label={char.shortName || char.name}
                   />
                 ))}
               </div>
               {/* Language Toggle */}
               <div className={styles.languageToggle}>
                 <label className={styles.switch}>
                   <input
                     type="checkbox"
                     checked={selectedLanguage === 'ku'}
                     onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedLanguage(e.target.checked ? 'ku' : 'en')}
                     disabled={loading}
                   />
                   <span className={styles.slider}></span>
                 </label>
                 <span className={styles.languageLabel}>{selectedLanguage === 'en' ? 'EN' : 'KU'}</span>
               </div>
             </div>
          </header>

          <div className={styles.chatMessages} ref={chatContainerRef}>
            {/* Display initial message or prompt if needed */}
            {chatHistory.length === 0 && !loading && (
               <div className={styles.emptyChatMessage}>
                 Start the conversation!
                </div>
              )}
             {chatHistory.map((chat, index) => (
               <div
                 key={index}
                 className={`${styles.messageBubble} ${chat.role === 'user' ? styles.userMessage : styles.modelMessage}`}
                 lang={chat.lang} // Set lang attribute
                 dir={chat.lang === 'ku' ? 'rtl' : 'ltr'} // Set direction based on message lang
               >
                 {/* Ensure paragraph also inherits direction if needed, though div should suffice */}
                 <p>{chat.parts[0].text}</p>
               </div>
             ))}
            {loading && <div className={styles.loadingIndicator}><span>.</span><span>.</span><span>.</span></div>}
          </div>

          <footer className={styles.chatInputArea}>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <button
                type="button"
                onClick={handleMicClick}
                className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
                aria-label={isRecording ? "Stop recording" : "Start voice input"}
              >
                {/* Microphone icon could be added here (font icon or SVG) */}
                🎤
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${currentCharacter.name}...`}
                dir={selectedLanguage === 'ku' ? 'rtl' : 'ltr'} // Add direction based on selected language
                className={styles.messageInput}
                disabled={loading}
              />
              <button 
                type="submit" 
                className={styles.sendButton}
                disabled={!message.trim() || loading}
                aria-label="Send message"
              >
                {/* Send icon could be added here (font icon or SVG) */}
                ➤
              </button>
            </form>
          </footer>
      </main>
    </>
  );
} 