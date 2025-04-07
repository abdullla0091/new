import type React from "react"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/app/i18n/LanguageContext";

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
  const { isKurdish } = useLanguage();
  
  return (
    <div
      className="flex items-center justify-between py-4 px-5 hover:bg-indigo-800/50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <span className={`${isKurdish ? 'mr-3 kurdish use-local-kurdish' : 'ml-3'} ${textColor} text-base`}>
          {label}
        </span>
      </div>
      {children ? children : <ChevronRight className={`h-5 w-5 text-gray-400 ${isKurdish ? 'rotate-180' : ''}`} />}
    </div>
  )
}

