import { toast } from "@/components/ui/use-toast";

interface TextToSpeechOptions {
  text: string;
  voice?: string;
  speed?: number;
  language?: 'en' | 'ku';
}

class VoiceService {
  private apiKey: string | null = null;
  private baseUrl = 'https://platform.krd/api/v1/text-to-speech';
  private audioContext: AudioContext | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private isPlaying = false;
  
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PLATFORM_KRD_API_KEY || null;
    
    // Initialize AudioContext lazily when needed
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  public async speakText({
    text,
    voice = 'default',
    speed = 1.0,
    language = 'en'
  }: TextToSpeechOptions): Promise<void> {
    if (!this.apiKey) {
      toast({
        title: "API Key Missing",
        description: "Platform KRD API key is not configured.",
        variant: "destructive"
      });
      return;
    }

    if (!text || text.trim() === '') {
      return;
    }

    try {
      if (!this.audioContext) {
        this.initialize();
      }

      // Stop any currently playing speech
      this.stop();

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text,
          voice,
          speed,
          language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const audioData = await response.arrayBuffer();
      
      if (!this.audioContext) {
        throw new Error('AudioContext not initialized');
      }

      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = audioBuffer;
      this.audioSource.connect(this.audioContext.destination);
      
      this.audioSource.onended = () => {
        this.isPlaying = false;
      };

      this.audioSource.start();
      this.isPlaying = true;
      
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      toast({
        title: "Speech Error",
        description: error instanceof Error ? error.message : "Failed to convert text to speech",
        variant: "destructive"
      });
    }
  }

  public stop(): void {
    if (this.audioSource && this.isPlaying) {
      try {
        this.audioSource.stop();
      } catch (error) {
        // Ignore errors from stopping already stopped sources
      }
      this.audioSource.disconnect();
      this.audioSource = null;
      this.isPlaying = false;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 
           (typeof window.AudioContext !== 'undefined' || 
            typeof (window as any).webkitAudioContext !== 'undefined');
  }
}

// Export as singleton
const voiceService = new VoiceService();
export default voiceService; 