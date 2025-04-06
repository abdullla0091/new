import { ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white">
      {/* Add decorative elements like on landing page */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
      
      {/* Add a subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-transparent to-indigo-950/70 z-[1]"></div>
      
      {/* Content container with z-index to appear above background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 