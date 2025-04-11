import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import Script from "next/script"
import { LanguageProvider } from "./i18n/LanguageContext"

const inter = Inter({ subsets: ["latin"] })

const RootLayoutClient = dynamic(() => import("./root-layout-client"), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "Nestro Chat - AI Characters with Personality",
  description: "Experience conversations with unique AI characters that have distinct personalities and expertise.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/kurdish-font/NizarBukraRegular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/kurdish-font/kurdish-font.css" />
        <link 
          rel="preload"
          href="/navigation-fix.js"
          as="script"
        />
      </head>
      <body className={cn("min-h-screen antialiased bg-background", inter.className)}>
        <LanguageProvider>
          <Providers>
            <RootLayoutClient>{children}</RootLayoutClient>
          </Providers>
        </LanguageProvider>
        
        <Script src="/kurdish-font-fix.js" strategy="lazyOnload" />
        <Script src="/navigation-fix.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
} 