'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ClipboardList, Users, FlaskRoundIcon as Flask, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* <Navbar /> */}

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 sm:py-32">
          <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:linear-gradient(0deg,white,transparent)] dark:bg-grid-gray-700/50"></div>
          <div className="container relative mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  Connecting Rare Disease Patients to Clinical Trials
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                  CURE NET helps patients with rare diseases find and participate in clinical trials that matter. 
                  Join our network to access specialized research opportunities and contribute to groundbreaking medical discoveries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isLoggedIn ? (
                    <Button size="lg" className="text-lg" onClick={() => router.push('/dashboard')}>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" className="text-lg" onClick={() => router.push('/login')}>
                        Join CURE NET
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button size="lg" variant="outline" className="text-lg" onClick={() => router.push('/about')}>
                        Learn More
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="relative lg:block">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Medical research illustration"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose CURE NET?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
                  <p className="text-muted-foreground">
                    Our advanced algorithm matches you with trials based on your specific condition and criteria.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                  <p className="text-muted-foreground">
                    Get guidance from medical professionals throughout your trial journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Flask className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Latest Research</h3>
                  <p className="text-muted-foreground">
                    Access cutting-edge clinical trials from leading research institutions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                  <p className="text-muted-foreground">
                    Your data is protected with enterprise-grade security and encryption.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-blue-600 dark:bg-blue-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-xl opacity-90">Active Clinical Trials</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-xl opacity-90">Patients Connected</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">150+</div>
                <div className="text-xl opacity-90">Research Institutions</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How CURE NET Works</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-full w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up and provide your medical history, conditions, and preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-full w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                    <p className="text-muted-foreground">
                      Our system automatically matches you with relevant clinical trials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-full w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Connect & Participate</h3>
                    <p className="text-muted-foreground">
                      Connect with researchers and participate in groundbreaking studies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Sarah Johnson"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground">Rare Autoimmune Condition</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Through CURE NET, I found a clinical trial that led to a breakthrough treatment for my condition. 
                    The platform made it easy to find studies that were relevant to my specific case."
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Dr. Michael Chen"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">Dr. Michael Chen</h4>
                      <p className="text-sm text-muted-foreground">Principal Investigator</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "CURE NET has revolutionized our patient recruitment process. We've been able to connect with exactly 
                    the right candidates for our rare disease studies, accelerating our research timeline."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of Joining</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">For Patients</h3>
                <ul className="space-y-3">
                  {[
                    "Access to cutting-edge treatments",
                    "Personalized trial matching",
                    "Expert medical support",
                    "Regular health monitoring",
                    "Contribute to medical research",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">For Researchers</h3>
                <ul className="space-y-3">
                  {[
                    "Efficient patient recruitment",
                    "Qualified candidate matching",
                    "Streamlined communication",
                    "Real-time progress tracking",
                    "Comprehensive data analytics",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 dark:bg-blue-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join CURE NET today and connect with clinical trials that matter to you.
            </p>
            {isLoggedIn ? (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Sign Up Now</Link>
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}