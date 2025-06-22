import { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
      <div className="bg-indigo-900/60 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-300 text-center">{description}</p>
    </div>
  )
} 