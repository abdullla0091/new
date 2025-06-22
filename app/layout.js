import "./globals.css";
import { Providers } from "./providers";
import RootLayoutClient from "./root-layout-client";

export const metadata = {
  title: "Character AI Clone",
  description: "Chat with your favorite characters.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
} 