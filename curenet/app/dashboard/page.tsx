'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Activity, Calendar, ClipboardList, FileText, User, User2, ArrowRight, Bell } from 'lucide-react'
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Types
interface Trial {
  id: string
  title: string
  status: string
  phase: string
  condition: string
  location: string
  startDate: string
  description: string
  eligibility: string[]
}

interface PatientProfile {
  name: string
  age: number
  diagnoses: Array<{
    disease: string
    severity: string
  }>
  lastUpdated?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [trials, setTrials] = useState<Trial[]>([])
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "patients", user.uid))
        if (userDoc.exists()) {
          setProfile({
            name: userDoc.data().name,
            age: userDoc.data().age,
            diagnoses: userDoc.data().diagnoses || [],
            lastUpdated: userDoc.data().updatedAt?.toDate().toLocaleDateString()
          })
        }

        // Fetch trials
        const trialsQuery = query(
          collection(db, "trials"),
          where("status", "==", "approved"),
          limit(5)
        )
        const trialsSnapshot = await getDocs(trialsQuery)
        const trialsData = trialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Trial[]
        setTrials(trialsData)
      } catch (err) {
        setError("Error loading dashboard data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}
      
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <User2 className="h-6 w-6" />
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.name}</span>
                  <span className="text-xs text-muted-foreground">Patient Dashboard</span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard">
                      <Activity className="h-4 w-4" />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/trials">
                      <ClipboardList className="h-4 w-4" />
                      <span>Clinical Trials</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/appointments">
                      <Calendar className="h-4 w-4" />
                      <span>Appointments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/documents">
                      <FileText className="h-4 w-4" />
                      <span>Documents</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/settings">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {profile?.name}
                  </p>
                </div>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </div>

              {error && (
                <Card className="mb-6 border-destructive">
                  <CardContent className="pt-6">
                    <p className="text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Summary</CardTitle>
                    <CardDescription>
                      Last updated: {profile?.lastUpdated || 'Never'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Age</label>
                        <p>{profile?.age} years old</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Diagnoses</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile?.diagnoses.map((diagnosis, index) => (
                            <Badge key={index} variant="secondary">
                              {diagnosis.disease} - {diagnosis.severity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/profile">Update Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Quick Actions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and actions</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/trials/search">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Find New Trials
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/appointments/schedule">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Appointment
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/documents/upload">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Activity</CardTitle>
                    <CardDescription>Recent platform activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Trials Matched</span>
                        <span className="font-medium">{trials.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Profile Completion</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Documents Uploaded</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Matched Trials Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Matched Clinical Trials</h2>
                  <Button variant="outline" asChild>
                    <Link href="/trials">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-6">
                  {trials.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                          No matching trials found. Update your profile to find relevant trials.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    trials.map((trial) => (
                      <Card key={trial.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{trial.title}</CardTitle>
                              <CardDescription>{trial.condition}</CardDescription>
                            </div>
                            <Badge>{trial.phase}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {trial.description}
                          </p>
                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Start Date: {trial.startDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-muted-foreground" />
                              <span>Location: {trial.location}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <Link href={`/trials/${trial.id}`}>
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  )
}