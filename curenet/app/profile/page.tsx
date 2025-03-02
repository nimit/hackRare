'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/footer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface PatientProfile {
  name: string;
  age: number;
  diagnoses: Array<{
    disease: string;
    severity: string;
  }>;
  lastUpdated?: string;
}

// Define schema for profile update form
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  age: z.coerce.number().min(1).max(120),
  diagnoses: z.array(
    z.object({
      disease: z.string().min(1),
      severity: z.string().min(1),
    })
  ),
  height: z.array(
    z.object({
      date: z.date(),
      value: z.coerce.number().min(50).max(250),
    })
  ),
  weight: z.array(
    z.object({
      date: z.date(),
      value: z.coerce.number().min(20).max(300),
    })
  ),
  medications: z.array(
    z.object({
      medicine: z.string().min(1),
      dosage: z.string().min(1),
      start_date: z.date(),
      end_date: z.date().nullable().optional(),
    })
  ),
  allergies: z.array(z.string().min(1)),
});

export default function ProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      age: profile?.age || 0,
      diagnoses: profile?.diagnoses || [],
      height: [],
      weight: [],
      medications: [],
      allergies: [],
    },
  });

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control: form.control,
    name: 'diagnoses',
  });

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: 'allergies',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
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
      } catch (err) {
        setError('Error loading profile data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      // Update profile in Firestore
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, 'patients', user.uid),
          {
            ...values,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setError('');
        router.refresh();
      }
    } catch (err) {
      setError('Error updating profile');
      console.error(err);
    }
  };

  const handleEditClick = () => {
    // Reset form with current profile data
    form.reset({
      name: profile?.name || '',
      age: profile?.age || 0,
      diagnoses: profile?.diagnoses || [],
      height: [],
      weight: [],
      medications: [],
      allergies: [],
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
          <DashboardSidebar profile={profile} activePage="profile" />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                  <p className="text-muted-foreground">
                    Manage your personal information
                  </p>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={handleEditClick}>
                    Edit Profile
                  </Button>
                )}
              </div>

              {error && (
                <Card className="mb-6 border-destructive">
                  <CardContent className="pt-6">
                    <p className="text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}

              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Diagnoses */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Diagnoses</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {diagnosisFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormField
                              control={form.control}
                              name={`diagnoses.${index}.disease`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Disease</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`diagnoses.${index}.severity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Severity</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeDiagnosis(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            appendDiagnosis({ disease: '', severity: '' })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Diagnosis
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Medications */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Medications</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {medicationFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormField
                              control={form.control}
                              name={`medications.${index}.medicine`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Medicine</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`medications.${index}.dosage`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dosage</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`medications.${index}.start_date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      selected={field.value}
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeMedication(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            appendMedication({
                              medicine: '',
                              dosage: '',
                              start_date: new Date(),
                            })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Medication
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Allergies */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Allergies</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {allergyFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2"
                          >
                            <FormField
                              control={form.control}
                              name={`allergies.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeAllergy(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => appendAllergy('')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Allergy
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Height and Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Height</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {form.watch('height').map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <FormField
                                control={form.control}
                                name={`height.${index}.value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`height.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                      <DatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              appendHeight({
                                value: 0,
                                date: new Date(),
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Height Entry
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Weight</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {form.watch('weight').map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <FormField
                                control={form.control}
                                name={`weight.${index}.value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`weight.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                      <DatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              appendWeight({
                                value: 0,
                                date: new Date(),
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Weight Entry
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  {/* Profile Summary Card */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Profile Summary</CardTitle>
                      <CardDescription>
                        Last updated: {profile?.lastUpdated || 'Never'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Name
                          </label>
                          <p>{profile?.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Age
                          </label>
                          <p>{profile?.age} years old</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Diagnoses
                          </label>
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
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleEditClick}
                      >
                        Update Profile
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
