import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner";
import Header from '@/components/layout/header'
import { TooltipProvider } from '@/components/ui/tooltip';
import { Suspense } from 'react';

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
          <TooltipProvider>
            <Toaster richColors position="top-center" />
            <main className="min-h-screen pt-16">
              <Suspense fallback={<p>Loading...</p>}>
                {children}
              </Suspense>
            </main>
          </TooltipProvider>

        </ThemeProvider>
      </body>
    </html>
  )
}
