'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Shield, Lock, EyeOff, Database, Key } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy and data security are our top priorities. We are
              committed to protecting your information with the highest
              standards of security.
            </p>
          </div>
        </section>

        {/* Security Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              How We Protect Your Data
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  End-to-End Encryption
                </h3>
                <p className="text-muted-foreground">
                  All your data is encrypted both in transit and at rest,
                  ensuring it remains secure at all times.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <EyeOff className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Zero Access Policy
                </h3>
                <p className="text-muted-foreground">
                  Not even our administrators can access your personal data.
                  Your information is yours alone.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <Database className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                <p className="text-muted-foreground">
                  Your data is stored in secure, ISO 27001-certified data
                  centers with multiple layers of protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Usage Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              How We Use Your Data
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-start gap-4">
                <Key className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Clinical Trial Matching
                  </h3>
                  <p className="text-muted-foreground">
                    We use your medical information solely to match you with
                    relevant clinical trials. This data is never shared with
                    third parties without your explicit consent.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Anonymized Research
                  </h3>
                  <p className="text-muted-foreground">
                    For research purposes, we may use anonymized and aggregated
                    data that cannot be traced back to individual users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Your Privacy Rights
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Access & Control</h3>
                <p className="text-muted-foreground">
                  You have the right to access, update, or delete your personal
                  information at any time through your account settings.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Data Portability</h3>
                <p className="text-muted-foreground">
                  You can request a copy of your data in a machine-readable
                  format for transfer to another service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 dark:bg-blue-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Have Questions?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              If you have any questions about our privacy practices or how we
              protect your data, please don't hesitate to reach out.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
