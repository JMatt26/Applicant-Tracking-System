import "~/styles/globals.css"

import { Inter } from "next/font/google"
import { Toaster } from "~/components/ui/sonner"
import Navbar from "~/components/Navbar"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata = {
    title: "ATS Scanner",
    description: "ATS Scanner",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({ children }: { children: React.ReactNode; modal: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`font-sans ${inter.variable} light`}>
                    <Navbar />
                    <main className="overflow-y-scroll">{children}</main>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    )
}
