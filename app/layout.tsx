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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
         
            <main className="min-h-screen pt-16">
              {children}
            </main>
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}