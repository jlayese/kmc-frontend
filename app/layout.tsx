import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner";
import Header from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Gabe's DigiStore",
  description: 'Your local marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
         
         <Header />
          {/* Wrapper ensures `main` takes available space & scrolls only when needed */}
          <div className="flex flex-col flex-grow">
            <main className="flex-grow overflow-auto ">
              {children}
            </main>
          </div>
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
