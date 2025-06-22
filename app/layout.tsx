import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const inter = Inter({ subsets: ["latin"] })

const RootLayoutClient = dynamic(() => import("./root-layout-client"), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "CharacterChat - AI Characters with Personality",
  description: "Experience conversations with unique AI characters that have distinct personalities and expertise.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased", inter.className)}>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  )
} 