import type React from "react"
import { ChevronRight } from "lucide-react"

export default function ProfileItem({
  icon,
  label,
  textColor = "text-gray-700 dark:text-gray-300",
  children,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  textColor?: string
  children?: React.ReactNode
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg"
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <span className={`ml-3 ${textColor}`}>{label}</span>
      </div>
      {children ? children : <ChevronRight className="h-5 w-5 text-gray-400" />}
    </div>
  )
}

