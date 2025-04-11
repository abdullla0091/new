import type React from "react"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex items-center justify-between py-5 px-6 hover:bg-indigo-800/50 cursor-pointer transition-colors duration-200",
        isKurdish && "flex-row-reverse"
      )}
      onClick={onClick ? (e) => {
        e.preventDefault();
        onClick();
      } : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) {
          onClick();
        }
      }}
    >
      <div className={cn("flex items-center", isKurdish && "flex-row-reverse")}>
        {icon}
        <span className={cn(
          textColor, 
          "text-base", 
          isKurdish ? "mr-4 kurdish use-local-kurdish" : "ml-4"
        )}>
          {label}
        </span>
      </div>
      {children ? children : (
        <ChevronRight 
          className={cn("h-5 w-5 text-gray-400", isKurdish && "rotate-180")} 
          aria-hidden="true"
        />
      )}
    </div>
  )
}

