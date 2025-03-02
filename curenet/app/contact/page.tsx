'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Reach out to us for any questions or support.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Email Section */}
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <div className="space-y-2">
                  <a
                    href="mailto:harsh.h.shah@stonybrook.edu"
                    className="text-muted-foreground hover:text-blue-600 block"
                  >
                    harsh.h.shah@stonybrook.edu
                  </a>
                  <a
                    href="mailto:aliasgar.padaria@stonybrook.edu"
                    className="text-muted-foreground hover:text-blue-600 block"
                  >
                    aliasgar.padaria@stonybrook.edu
                  </a>
                  <a
                    href="mailto:nimit.b.shah@stonybrook.edu"
                    className="text-muted-foreground hover:text-blue-600 block"
                  >
                    nimit.b.shah@stonybrook.edu
                  </a>
                  <a
                    href="mailto:paramkamleshku.patel@stonybrook.edu"
                    className="text-muted-foreground hover:text-blue-600 block"
                  >
                    paramkamleshku.patel@stonybrook.edu
                  </a>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <MapPin className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                <p className="text-muted-foreground">
                  Stony Brook University
                  <br />
                  Stony Brook, NY 11794
                </p>
              </div>

              {/* Phone Section */}
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <Phone className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground">+1 (631) 632-6000</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 dark:bg-blue-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our team is ready to help you with any questions or concerns.
            </p>
            <Button variant="secondary" asChild>
              <Link href="mailto:harsh.h.shah@stonybrook.edu">
                Email Us Now
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
