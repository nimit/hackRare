'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Calendar, User, FileText, Bell } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
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
import { SuccessPopup } from '@/components/success-popup';

interface Trial {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  phase: string;
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

export default function TrialsPage() {
  const router = useRouter();
  const [trials, setTrials] = useState<Trial[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
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
        const q = query(
          collection(db, 'trials'),
          where('participants', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const trialsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trial[];
        setTrials(trialsData);
      } catch (err) {
        setError('Error loading clinical trials data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleTrialApplication = async (trialId: string) => {
    try {
      // Mock trial application process
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Error applying to trial');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-4">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar profile={profile} activePage="trials" />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Clinical Trials
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your clinical trial participation
                  </p>
                </div>
                <Button asChild>
                  <Link href="/trials/search">Find New Trials</Link>
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
                {trials.map((trial) => (
                  <Card key={trial.id}>
                    <CardHeader>
                      <CardTitle>{trial.title}</CardTitle>
                      <CardDescription>
                        {trial.location} | {trial.phase}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Status
                          </label>
                          <Badge
                            variant={
                              trial.status === 'Active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {trial.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Duration
                          </label>
                          <p>
                            {trial.startDate} - {trial.endDate}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Description
                          </label>
                          <p className="text-sm line-clamp-3">
                            {trial.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleTrialApplication(trial.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Applying...' : 'Apply to Trial'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />

      {showSuccess && (
        <SuccessPopup message="Trial application submitted successfully!" />
      )}
    </div>
  );
}
