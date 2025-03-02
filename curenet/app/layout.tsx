import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'CURE NET',
  description: 'Clinical United Research Network Secure Portal',
  // generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
