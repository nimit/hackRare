'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  User,
  User2,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from 'firebase/firestore';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

// Types
interface Trial {
  id: string;
  title: string;
  status: string;
  phase: string;
  condition: string;
  location: string;
  startDate: string;
  description: string;
  eligibility: string[];
}

interface PatientProfile {
  name: string;
  age: number;
  diagnoses: Array<{
    disease: string;
    severity: string;
  }>;
  lastUpdated?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'patients', user.uid));
        if (userDoc.exists()) {
          setProfile({
            name: userDoc.data().name,
            age: userDoc.data().age,
            diagnoses: userDoc.data().diagnoses || [],
            lastUpdated: userDoc
              .data()
              .updatedAt?.toDate()
              .toLocaleDateString(),
          });
        }

        // Fetch trials
        const trialsQuery = query(
          collection(db, 'trials'),
          where('status', '==', 'approved'),
          limit(5)
        );
        const trialsSnapshot = await getDocs(trialsQuery);
        const trialsData = trialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trial[];
        setTrials(trialsData);
      } catch (err) {
        setError('Error loading dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex px-4">
          1
          <DashboardSidebar profile={profile} activePage="dashboard" />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard
                  </h1>
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
                {/* Quick Actions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and actions</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/trials/search">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Find New Trials
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/appointments/schedule">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Appointment
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
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
                        <span className="text-sm text-muted-foreground">
                          Profile Completion
                        </span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Documents Uploaded
                        </span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}
