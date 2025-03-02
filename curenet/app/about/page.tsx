'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Users, HeartPulse, Target, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              About CURE NET
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering patients and advancing medical research through
              innovative clinical trial matching.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  At CURE NET, our mission is to bridge the gap between patients
                  with rare diseases and the clinical trials that could
                  transform their lives. We believe that every patient deserves
                  access to cutting-edge treatments and the opportunity to
                  contribute to medical breakthroughs.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/trials">Explore Clinical Trials</Link>
                </Button>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
                <p className="text-muted-foreground">
                  We're building a global network of patients, researchers, and
                  healthcare providers to accelerate medical innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Patient-Centric
                  </h3>
                  <p className="text-muted-foreground">
                    We prioritize patient needs, ensuring their safety, privacy,
                    and well-being throughout the clinical trial process.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <HeartPulse className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Innovation-Driven
                  </h3>
                  <p className="text-muted-foreground">
                    We leverage advanced technology and data science to improve
                    clinical trial matching and outcomes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Integrity First
                  </h3>
                  <p className="text-muted-foreground">
                    We maintain the highest ethical standards in all our
                    operations and partnerships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Dr. Emily Carter"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">
                    Ali Asgar Padaria
                  </h3>
                  <p className="text-muted-foreground text-center"></p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Michael Zhang"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">
                    Harsh Shah
                  </h3>
                  <p className="text-muted-foreground text-center"></p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Sarah Johnson"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">
                    Nimit Shah
                  </h3>
                  <p className="text-muted-foreground text-center"></p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Sarah Johnson"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">
                    Param Patel
                  </h3>
                  <p className="text-muted-foreground text-center"></p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 dark:bg-blue-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're a patient, researcher, or healthcare provider, we
              invite you to be part of our journey to transform rare disease
              treatment.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" asChild>
                <Link href="/login">Sign Up</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
