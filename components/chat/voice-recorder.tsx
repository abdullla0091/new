import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface VoiceRecorderProps {
  onVoiceRecorded: (blob: Blob) => void;
  onCancel: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

export default function VoiceRecorder({
  onVoiceRecorded,
  onCancel,
  isRecording,
  setIsRecording
}: VoiceRecorderProps) {
  const { language } = useLanguage();
  const isKurdish = language === 'ku';
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks from stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert(isKurdish ? 'ناتوانرێت دەست بە تۆمارکردن بکرێت' : 'Could not start recording');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    onCancel();
  };
  
  const sendRecording = () => {
    if (audioBlob) {
      onVoiceRecorded(audioBlob);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  return (
    <div className="flex flex-col w-full">
      {/* Recording interface */}
      {isRecording && (
        <div className="flex items-center justify-between bg-indigo-900/70 rounded-lg p-3 mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3"></div>
            <span className="text-white">
              {isKurdish ? 'تۆمارکردن' : 'Recording'} {formatTime(recordingTime)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={cancelRecording}
              className="text-white hover:bg-indigo-800/50"
            >
              <X className="w-4 h-4 mr-1" />
              {isKurdish ? 'لابردن' : 'Cancel'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={stopRecording}
              className="text-white hover:bg-indigo-800/50"
            >
              <StopCircle className="w-4 h-4 mr-1" />
              {isKurdish ? 'وەستان' : 'Stop'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Audio preview */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between bg-indigo-900/70 rounded-lg p-3 mb-2">
          <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={cancelRecording}
              className="text-white hover:bg-indigo-800/50"
            >
              <X className="w-4 h-4 mr-1" />
              {isKurdish ? 'لابردن' : 'Cancel'}
            </Button>
            <Button 
              type="button" 
              variant="default" 
              size="sm"
              onClick={sendRecording}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="w-4 h-4 mr-1" />
              {isKurdish ? 'ناردن' : 'Send'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Recording button */}
      {!isRecording && !audioUrl && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={startRecording}
          className="h-8 w-8 hover:bg-indigo-600/20 text-white"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
} 