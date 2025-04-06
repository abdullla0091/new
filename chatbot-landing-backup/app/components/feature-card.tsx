import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-indigo-800/30 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-purple-500/20 group">
      <div className="mb-6 bg-indigo-900/50 p-4 rounded-lg inline-block group-hover:bg-purple-600/50 transition-colors duration-300">
        <div className="transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors duration-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

