"use client"

import { FileText, Settings, Menu, X, LogIn } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const currentPage = usePathname()

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: FileText, current: currentPage.indexOf("/dashboard") != -1 },
        { name: "Settings", href: "/settings", icon: Settings, current: currentPage === "/settings" },
    ]

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href={"/"} className="flex-shrink-0 flex items-center">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">ATS Scanner</span>
                        </Link>
                        <SignedIn>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${
                                            item.current
                                                ? "border-blue-500 text-gray-900"
                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        <item.icon className="h-4 w-4 mr-2" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </SignedIn>
                    </div>
                    <div className="hidden sm:flex">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <div className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-blue-500 text-gray-900">
                                <LogIn className="h-4 w-4 mr-2" />
                                <SignInButton />
                            </div>
                        </SignedOut>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${
                                    item.current
                                        ? "bg-blue-50 border-blue-500 text-blue-700"
                                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <div className="flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
                                <LogIn className="h-4 w-4 mr-2" />
                                <SignInButton />
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    )
}
