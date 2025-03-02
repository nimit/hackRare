// app/clinic/layout.tsx (updated)
"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/clinic_store'
import { Navbar } from '@/components/navbar'

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  
  // Public routes that don't require authentication
  const isPublicRoute = pathname === '/clinic/login'
  
  useEffect(() => {
    if (!isPublicRoute) {
      // Check if user is authenticated and is a clinic user
      if (!user) {
        router.push('/clinic/login')
        return
      }
    } else if (user) {
      router.push('/clinic/dashboard')
      return
    }
    
    setIsLoading(false)
  }, [user, profile, router, pathname, isPublicRoute])
  
  // Show loading while checking authentication
  if (!isPublicRoute && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Don't show navbar on public routes like login
  return (
    <>
      {children}
    </>
  )
}