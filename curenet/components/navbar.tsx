"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { ThemeToggle } from "./theme-provider"
import { usePathname } from 'next/navigation'
import { ClinicNavbar } from "./ClinicNavbar"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
    })

    return () => unsubscribe()
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  let pathName = usePathname()
  if (pathName.startsWith('/clinic')) {
    return <ClinicNavbar isLoggedIn={isLoggedIn} />;
  }

  return (
    <nav className="w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-2xl font-bold">CURE NET</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <ThemeToggle />
            {isLoggedIn ? (
              <Button asChild onClick={() => auth.signOut()} variant="default">
                <Link href="/login">Sign Out</Link>
              </Button>
            ) : pathName.endsWith('login') ? (<></>) : (
              <Button asChild variant="default">
                <Link href="/login">Login / Signup</Link>
              </Button>
            )}
          </div>

            
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Privacy Policy
              </Link>
              {isLoggedIn ? (
                <Button asChild variant="default" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button asChild variant="default" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                  <Link href="/login">Login / Signup</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}