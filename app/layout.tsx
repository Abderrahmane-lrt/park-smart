import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ParkSmart - AI-Powered Smart Parking | Casablanca",
  description:
    "Find and book parking spots in Casablanca with AI-powered predictions, real-time availability, and seamless payment integration. Save time with smart parking.",
  keywords: "parking, Casablanca, Morocco, smart parking, AI parking, booking, urban mobility, parking spots",
  authors: [{ name: "ParkSmart Team" }],
  openGraph: {
    title: "ParkSmart - Smart Parking in Casablanca",
    description: "AI-powered parking solution for Casablanca. Find, book, and pay for parking spots with ease.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParkSmart - Smart Parking in Casablanca",
    description: "AI-powered parking solution for Casablanca",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
