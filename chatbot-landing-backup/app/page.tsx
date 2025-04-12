import Link from "next/link"
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeatureCard from "./components/feature-card"
import CharacterShowcase from "./components/character-showcase"
import SimplifiedBackground from "./components/simplified-background"
import CharacterEyes from "./components/character-eyes"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-800 to-indigo-900 text-white overflow-hidden">
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.2);
            opacity: 0.4;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>

      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <Image 
              src="/images/logo.png" 
              alt="Nestro Chat Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl">Nestro Chat</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="#characters" className="hover:text-purple-400 transition-colors">
            Characters
          </Link>
          <Link href="#features" className="hover:text-purple-400 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-purple-400 transition-colors">
            How it Works
          </Link>
        </nav>
        <Button
          variant="outline"
          className="hidden md:flex border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-colors"
        >
          Sign In
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </header>

      {/* Hero Section with Simplified Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Option 1: Simplified Background */}
        <SimplifiedBackground />

        {/* Add a more vibrant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 via-purple-700/30 to-indigo-800/60 z-[1]"></div>
        
        {/* Add animated particles for more vibrance */}
        <div className="absolute inset-0 z-[1] overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/20"
              style={{
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 150 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse ${Math.random() * 8 + 5}s infinite alternate`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <div className="bg-indigo-900/20 backdrop-blur-md p-8 md:p-12 rounded-3xl max-w-4xl mx-auto border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <div className="relative h-24 md:h-32 mb-4">
              <CharacterEyes />
            </div>
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-[4.5rem] leading-tight font-bold mb-6">
                Chat with <span className="text-purple-400">Unique Characters</span>, Not Just Another Bot
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Experience conversations with personality. Our AI-powered characters bring a new dimension to chatbot
                interactions.
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-lg text-lg mx-auto shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              Meet Our Characters
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Character Showcase Section */}
      <section id="characters" className="container mx-auto px-4 py-20 relative">
        {/* Add decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-16 relative z-10">
          <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
            MEET THE TEAM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
            Meet Our Characters
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Each with their own personality, expertise, and conversation style.
          </p>
        </div>

        <CharacterShowcase />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 overflow-hidden">
        {/* Add background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800/70 to-indigo-900/90"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-indigo-950 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-indigo-950 to-transparent"></div>

        {/* Add floating shapes */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        
        {/* Add additional floating elements */}
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"
          style={{ animation: "pulse 8s infinite alternate", animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
              CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Unique Features
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover what makes our character-based chatbot experience special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-purple-400" />}
              title="Distinct Personalities"
              description="Each character has their own backstory, expertise, and conversation style for a more engaging experience."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-purple-400" />}
              title="Contextual Memory"
              description="Characters remember your conversations and build relationships over time."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-purple-400" />}
              title="Safe Interactions"
              description="All characters are designed to provide helpful, appropriate responses in any context."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-md"></div>

        {/* Add animated gradient background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 animate-gradient-slow"></div>
        </div>
        
        {/* Add floating orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-xl"
          style={{ animation: "float 20s infinite ease-in-out" }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 blur-xl"
          style={{ animation: "float 25s infinite ease-in-out reverse", animationDelay: "2s" }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
              SIMPLE PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              How It Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Start chatting with our characters in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose a Character</h3>
              <p className="text-gray-300">
                Select from our diverse cast of AI characters based on your interests or needs.
              </p>
            </div>

            <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start a Conversation</h3>
              <p className="text-gray-300">
                Begin chatting naturally as you would with a friend. No special commands needed.
              </p>
            </div>

            <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Build a Relationship</h3>
              <p className="text-gray-300">
                Return to the same character to continue where you left off. They'll remember you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
            What People Are Saying
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hear from users who've experienced our character-based chatbot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-indigo-800/30 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold mr-4">
                J
              </div>
              <div>
                <h4 className="font-semibold">Jamie L.</h4>
                <p className="text-gray-400 text-sm">Product Designer</p>
              </div>
            </div>
            <p className="text-gray-300">
              "I love chatting with Professor Ada about design principles. It's like having a mentor available 24/7 who
              remembers our previous conversations!"
            </p>
          </div>

          <div className="bg-indigo-800/30 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold mr-4">
                M
              </div>
              <div>
                <h4 className="font-semibold">Michael T.</h4>
                <p className="text-gray-400 text-sm">Software Engineer</p>
              </div>
            </div>
            <p className="text-gray-300">
              "The character-based approach makes such a difference. I actually look forward to my coding discussions
              with Dev, who has a great sense of humor."
            </p>
          </div>

          <div className="bg-indigo-800/30 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold mr-4">
                S
              </div>
              <div>
                <h4 className="font-semibold">Sarah K.</h4>
                <p className="text-gray-400 text-sm">Student</p>
              </div>
            </div>
            <p className="text-gray-300">
              "I use Sage to help with my homework. The way they explain concepts makes learning so much more engaging
              than just searching online."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-3xl mx-auto relative">
          {/* Add glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-3xl transform scale-105"></div>

          <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 overflow-hidden">
            {/* Add animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                    animationDelay: `${Math.random() * 10}s`,
                  }}
                ></div>
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Chat with Characters?</h2>
              <p className="text-xl mb-8">
                Join thousands of users already experiencing a new way to interact with AI.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 rounded-lg text-lg font-semibold shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - completely hidden on mobile screens */}
      <footer className="bg-indigo-950 py-12 mt-auto hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="relative h-12 w-12">
                <Image 
                  src="/images/logo.png" 
                  alt="Nestro Chat Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">Nestro Chat</span>
            </div>
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-gray-400">© 2025 Nestro Chat. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

