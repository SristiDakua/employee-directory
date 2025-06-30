import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ApolloWrapper } from "@/lib/apollo-client"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Directory - SPACEAI",
  description: "Employee management system built with Next.js, GraphQL, and MongoDB",
  generator: 'Sristi'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <main className="min-h-screen bg-background">{children}</main>
        </ApolloWrapper>
        <Toaster />
      </body>
    </html>
  )
}
