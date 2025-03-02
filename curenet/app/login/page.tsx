'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription } from '@/components/ui/form';
import dummyData from './dummy-data';
import { SuccessPopup } from '@/components/success-popup';

// Helper function to convert kg to lb
const kgToLb = (kg: number) => {
  return (kg * 2.20462).toFixed(1);
};

// Helper function to convert cm to ft and inches
const cmToFtIn = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
};

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      useAuthStore.getState().setUser(userCredential.user);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Show loading for at least 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Define schema for signup form
  const signupSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    name: z.string().min(2, { message: 'Name is required' }),
    age: z.coerce.number().min(1).max(120),
    isMinor: z.boolean().default(false),
    gender: z.string().min(1, { message: 'Please select your gender' }),
    height: z
      .array(
        z.object({
          date: z.date(),
          value: z.coerce.number().min(50).max(250),
        })
      )
      .min(1),
    weight: z
      .array(
        z.object({
          date: z.date(),
          value: z.coerce.number().min(20).max(300),
        })
      )
      .min(1),
    family_history: z.array(
      z.object({
        disease: z.string().min(1),
        relation: z.string().min(1),
      })
    ),
    heart_rate: z.array(
      z.object({
        avg: z.coerce.number().min(30).max(200),
        min: z.coerce.number().min(30).max(200),
        max: z.coerce.number().min(30).max(200),
        time: z.date(),
      })
    ),
    blood_pressure: z.array(
      z.object({
        low: z.coerce.number().min(40).max(150),
        high: z.coerce.number().min(80).max(250),
        time: z.date(),
      })
    ),
    diagnoses: z.array(
      z.object({
        disease: z.string().min(1),
        active: z.boolean().default(true),
        severity: z.string().min(1),
      })
    ),
    immunizations: z.array(
      z.object({
        date: z.date(),
        vaccine: z.string().min(1),
      })
    ),
    medications: z.array(
      z.object({
        medicine: z.string().min(1),
        dosage: z.string().min(1),
        start_date: z.date(),
        end_date: z.date().nullable().optional(),
        side_effects: z.array(z.string().min(1)),
      })
    ),
    allergies: z.array(z.string().min(1)),
    genetic_abnormalities: z.array(
      z.object({
        gene_affected: z.string().min(1),
        date_detected: z.date(),
      })
    ),
    participation: z.array(
      z.object({
        studyId: z.string().min(1),
        participation_start: z.date(),
        participation_end: z.date().nullable().optional(),
        matched_criteria: z.array(z.string().min(1)),
      })
    ),
    patient_feedback: z.string().optional(),
    rating: z.coerce.number().min(1).max(10).optional(),
    patient_symptoms: z.array(z.string().min(1)),
    additional_comments: z.string().optional(),
  });

  // Create form
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      age: 0,
      isMinor: false,
      gender: '',
      height: [{ date: new Date(), value: 170 }],
      weight: [{ date: new Date(), value: 70 }],
      family_history: [{ disease: '', relation: '' }],
      heart_rate: [{ avg: 70, min: 60, max: 100, time: new Date() }],
      blood_pressure: [{ low: 70, high: 120, time: new Date() }],
      diagnoses: [{ disease: '', active: true, severity: '' }],
      immunizations: [{ date: new Date(), vaccine: '' }],
      medications: [
        {
          medicine: '',
          dosage: '',
          start_date: new Date(),
          side_effects: [''],
        },
      ],
      allergies: [''],
      genetic_abnormalities: [{ gene_affected: '', date_detected: new Date() }],
      participation: [
        {
          studyId: '',
          participation_start: new Date(),
          matched_criteria: [''],
        },
      ],
      patient_feedback: '',
      rating: 5,
      patient_symptoms: [''],
      additional_comments: '',
    },
  });

  // Create field arrays for multiple entries
  const {
    fields: heightFields,
    append: appendHeight,
    remove: removeHeight,
  } = useFieldArray({
    control: form.control,
    name: 'height',
  });

  const {
    fields: weightFields,
    append: appendWeight,
    remove: removeWeight,
  } = useFieldArray({
    control: form.control,
    name: 'weight',
  });

  const {
    fields: familyHistoryFields,
    append: appendFamilyHistory,
    remove: removeFamilyHistory,
  } = useFieldArray({
    control: form.control,
    name: 'family_history',
  });

  const {
    fields: heartRateFields,
    append: appendHeartRate,
    remove: removeHeartRate,
  } = useFieldArray({
    control: form.control,
    name: 'heart_rate',
  });

  const {
    fields: bloodPressureFields,
    append: appendBloodPressure,
    remove: removeBloodPressure,
  } = useFieldArray({
    control: form.control,
    name: 'blood_pressure',
  });

  const {
    fields: diagnosesFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control: form.control,
    name: 'diagnoses',
  });

  const {
    fields: immunizationsFields,
    append: appendImmunization,
    remove: removeImmunization,
  } = useFieldArray({
    control: form.control,
    name: 'immunizations',
  });

  const {
    fields: medicationsFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  const {
    fields: allergiesFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: 'allergies',
  });

  const {
    fields: geneticAbnormalitiesFields,
    append: appendGeneticAbnormality,
    remove: removeGeneticAbnormality,
  } = useFieldArray({
    control: form.control,
    name: 'genetic_abnormalities',
  });

  const {
    fields: participationFields,
    append: appendParticipation,
    remove: removeParticipation,
  } = useFieldArray({
    control: form.control,
    name: 'participation',
  });

  const {
    fields: patientSymptomsFields,
    append: appendPatientSymptom,
    remove: removePatientSymptom,
  } = useFieldArray({
    control: form.control,
    name: 'patient_symptoms',
  });

  // Nested field arrays for side effects and matched criteria
  const {
    fields: sideEffectsFields,
    append: appendSideEffect,
    remove: removeSideEffect,
  } = useFieldArray({
    control: form.control,
    name: 'medications.0.side_effects',
  });

  const {
    fields: matchedCriteriaFields,
    append: appendMatchedCriteria,
    remove: removeMatchedCriteria,
  } = useFieldArray({
    control: form.control,
    name: 'participation.0.matched_criteria',
  });

  // Handle signup
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      const userData = {
        ...values,
        user_id: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      delete userData.email;
      delete userData.password;

      await setDoc(doc(db, 'patients', user.uid), userData);

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setProfile(userData);

      // Show loading for at least 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fill form with dummy data
  const fillDummyData = () => {
    form.reset(dummyData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-950/90 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-50"></div>
        </div>
      )}

      {/* <Navbar /> */}

      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Login to CURE NET</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(
                              'Password reset functionality would be implemented here'
                            );
                          }}
                        >
                          Forgot password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm py-2">{error}</div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-center text-sm text-muted-foreground w-full">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign up
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <div className="mx-auto max-w-3xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Sign Up for CURE NET
                    </CardTitle>
                    <CardDescription>
                      Create your account to join the Clinical Unified Research
                      Network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      onClick={fillDummyData}
                      className="mb-6"
                    >
                      Autofill Dummy Data
                    </Button>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        {/* Account Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            Account Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="name@example.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Basic Information */}
                        <Accordion
                          type="single"
                          collapsible
                          defaultValue="basic-info"
                        >
                          <AccordionItem value="basic-info">
                            <AccordionTrigger>
                              <h3 className="text-lg font-semibold">
                                Basic Information
                              </h3>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Full Name"
                                          {...field}
                                        />
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
                                <FormField
                                  control={form.control}
                                  name="gender"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Gender</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="male">
                                            Male
                                          </SelectItem>
                                          <SelectItem value="female">
                                            Female
                                          </SelectItem>
                                          <SelectItem value="other">
                                            Other
                                          </SelectItem>
                                          <SelectItem value="prefer-not-to-say">
                                            Prefer not to say
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="isMinor"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>
                                          I am under 18 years of age
                                        </FormLabel>
                                        <FormDescription>
                                          Parental/guardian consent will be
                                          required
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Physical Measurements */}
                        <Accordion type="single" collapsible>
                          <AccordionItem value="physical-measurements">
                            <AccordionTrigger>
                              <h3 className="text-lg font-semibold">
                                Physical Measurements
                              </h3>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-6">
                                {/* Height */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Height Measurements
                                  </h4>
                                  {heightFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeHeight(index)}
                                        disabled={heightFields.length === 1}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`height.${index}.date`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`height.${index}.value`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Height (cm)</FormLabel>
                                            <FormControl>
                                              <div className="flex items-center">
                                                <Input
                                                  type="number"
                                                  {...field}
                                                />
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                  {cmToFtIn(
                                                    Number.parseFloat(
                                                      field.value.toString()
                                                    ) || 0
                                                  )}
                                                </span>
                                              </div>
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
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendHeight({
                                        date: new Date(),
                                        value: 170,
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Height Measurement
                                  </Button>
                                </div>

                                {/* Weight */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Weight Measurements
                                  </h4>
                                  {weightFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeWeight(index)}
                                        disabled={weightFields.length === 1}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`weight.${index}.date`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`weight.${index}.value`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Weight (kg)</FormLabel>
                                            <FormControl>
                                              <div className="flex items-center">
                                                <Input
                                                  type="number"
                                                  {...field}
                                                />
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                  {kgToLb(
                                                    Number.parseFloat(
                                                      field.value.toString()
                                                    ) || 0
                                                  )}{' '}
                                                  lb
                                                </span>
                                              </div>
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
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendWeight({
                                        date: new Date(),
                                        value: 70,
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Weight Measurement
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Family & Medical History */}
                        <Accordion type="single" collapsible>
                          <AccordionItem value="medical-history">
                            <AccordionTrigger>
                              <h3 className="text-lg font-semibold">
                                Family & Medical History
                              </h3>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-6">
                                {/* Family History */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Family History
                                  </h4>
                                  {familyHistoryFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() =>
                                          removeFamilyHistory(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`family_history.${index}.disease`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Disease/Condition
                                            </FormLabel>
                                            <FormControl>
                                              <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`family_history.${index}.relation`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Relation</FormLabel>
                                            <FormControl>
                                              <Input {...field} />
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
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendFamilyHistory({
                                        disease: '',
                                        relation: '',
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Family History
                                  </Button>
                                </div>

                                {/* Heart Rate */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">Heart Rate</h4>
                                  {heartRateFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeHeartRate(index)}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                          control={form.control}
                                          name={`heart_rate.${index}.avg`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Average (bpm)
                                              </FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name={`heart_rate.${index}.min`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Minimum (bpm)
                                              </FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name={`heart_rate.${index}.max`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Maximum (bpm)
                                              </FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>

                                      <FormField
                                        control={form.control}
                                        name={`heart_rate.${index}.time`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>Date/Time</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendHeartRate({
                                        avg: 70,
                                        min: 60,
                                        max: 100,
                                        time: new Date(),
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Heart Rate Data
                                  </Button>
                                </div>

                                {/* Blood Pressure */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Blood Pressure
                                  </h4>
                                  {bloodPressureFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() =>
                                          removeBloodPressure(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`blood_pressure.${index}.low`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Diastolic (mmHg)
                                            </FormLabel>
                                            <FormControl>
                                              <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`blood_pressure.${index}.high`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Systolic (mmHg)
                                            </FormLabel>
                                            <FormControl>
                                              <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`blood_pressure.${index}.time`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>Date/Time</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendBloodPressure({
                                        low: 70,
                                        high: 120,
                                        time: new Date(),
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Blood Pressure Data
                                  </Button>
                                </div>

                                {/* Diagnoses */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">Diagnoses</h4>
                                  {diagnosesFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeDiagnosis(index)}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`diagnoses.${index}.disease`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Disease/Condition
                                            </FormLabel>
                                            <FormControl>
                                              <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`diagnoses.${index}.active`}
                                        render={({ field }) => (
                                          <FormItem className="flex items-center space-x-2">
                                            <FormLabel>Active</FormLabel>
                                            <FormControl>
                                              <input
                                                type="checkbox"
                                                className="h-4 w-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                              />
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
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendDiagnosis({
                                        disease: '',
                                        active: true,
                                        severity: '',
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Diagnosis
                                  </Button>
                                </div>

                                {/* Immunizations */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">Immunizations</h4>
                                  {immunizationsFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() =>
                                          removeImmunization(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`immunizations.${index}.date`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`immunizations.${index}.vaccine`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Vaccine</FormLabel>
                                            <FormControl>
                                              <Input {...field} />
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
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendImmunization({
                                        date: new Date(),
                                        vaccine: '',
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Immunization
                                  </Button>
                                </div>

                                {/* Medications */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">Medications</h4>
                                  {medicationsFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeMedication(index)}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

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
                                          <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`medications.${index}.end_date`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      {/* Side Effects */}
                                      <div className="space-y-4">
                                        <h4 className="font-medium">
                                          Side Effects
                                        </h4>
                                        {sideEffectsFields.map(
                                          (field, index) => (
                                            <div
                                              key={field.id}
                                              className="grid grid-cols-1 gap-4 p-4 border rounded-md relative"
                                            >
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() =>
                                                  removeSideEffect(index)
                                                }
                                              >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">
                                                  Remove
                                                </span>
                                              </Button>

                                              <FormField
                                                control={form.control}
                                                name={`medications.${index}.side_effects`}
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormLabel>
                                                      Side Effect
                                                    </FormLabel>
                                                    <FormControl>
                                                      <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />
                                            </div>
                                          )
                                        )}

                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="mt-2"
                                          onClick={() => appendSideEffect('')}
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Side Effect
                                        </Button>
                                      </div>
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendMedication({
                                        medicine: '',
                                        dosage: '',
                                        start_date: new Date(),
                                        end_date: null,
                                        side_effects: [''],
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Medication
                                  </Button>
                                </div>

                                {/* Allergies */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">Allergies</h4>
                                  {allergiesFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeAllergy(index)}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`allergies.${index}`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Allergy</FormLabel>
                                            <FormControl>
                                              <Input {...field} />
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
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => appendAllergy('')}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Allergy
                                  </Button>
                                </div>

                                {/* Genetic Abnormalities */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Genetic Abnormalities
                                  </h4>
                                  {geneticAbnormalitiesFields.map(
                                    (field, index) => (
                                      <div
                                        key={field.id}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                      >
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute top-2 right-2"
                                          onClick={() =>
                                            removeGeneticAbnormality(index)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                          <span className="sr-only">
                                            Remove
                                          </span>
                                        </Button>

                                        <FormField
                                          control={form.control}
                                          name={`genetic_abnormalities.${index}.gene_affected`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Gene Affected
                                              </FormLabel>
                                              <FormControl>
                                                <Input {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name={`genetic_abnormalities.${index}.date_detected`}
                                          render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                              <FormLabel>
                                                Date Detected
                                              </FormLabel>
                                              <DatePicker
                                                date={field.value}
                                                setDate={field.onChange}
                                              />
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    )
                                  )}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendGeneticAbnormality({
                                        gene_affected: '',
                                        date_detected: new Date(),
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Genetic Abnormality
                                  </Button>
                                </div>

                                {/* Participation */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Participation in Studies
                                  </h4>
                                  {participationFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() =>
                                          removeParticipation(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`participation.${index}.studyId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Study ID</FormLabel>
                                            <FormControl>
                                              <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`participation.${index}.participation_start`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>
                                              Participation Start Date
                                            </FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`participation.${index}.participation_end`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                            <FormLabel>
                                              Participation End Date
                                            </FormLabel>
                                            <DatePicker
                                              date={field.value}
                                              setDate={field.onChange}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      {/* Matched Criteria */}
                                      <div className="space-y-4">
                                        <h4 className="font-medium">
                                          Matched Criteria
                                        </h4>
                                        {matchedCriteriaFields.map(
                                          (field, index) => (
                                            <div
                                              key={field.id}
                                              className="grid grid-cols-1 gap-4 p-4 border rounded-md relative"
                                            >
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() =>
                                                  removeMatchedCriteria(index)
                                                }
                                              >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">
                                                  Remove
                                                </span>
                                              </Button>

                                              <FormField
                                                control={form.control}
                                                name={`participation.${index}.matched_criteria`}
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormLabel>
                                                      Criteria
                                                    </FormLabel>
                                                    <FormControl>
                                                      <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />
                                            </div>
                                          )
                                        )}

                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="mt-2"
                                          onClick={() =>
                                            appendMatchedCriteria('')
                                          }
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Criteria
                                        </Button>
                                      </div>
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      appendParticipation({
                                        studyId: '',
                                        participation_start: new Date(),
                                        participation_end: new Date(),
                                        matched_criteria: [''],
                                      })
                                    }
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Participation
                                  </Button>
                                </div>

                                {/* Patient Symptoms */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Patient Symptoms
                                  </h4>
                                  {patientSymptomsFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      className="grid grid-cols-1 gap-4 p-4 border rounded-md relative"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() =>
                                          removePatientSymptom(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>

                                      <FormField
                                        control={form.control}
                                        name={`patient_symptoms.${index}`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Symptom</FormLabel>
                                            <FormControl>
                                              <Input {...field} />
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
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => appendPatientSymptom('')}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Symptom
                                  </Button>
                                </div>

                                {/* Patient Feedback */}
                                <FormField
                                  control={form.control}
                                  name="patient_feedback"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Patient Feedback</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter feedback"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Rating */}
                                <FormField
                                  control={form.control}
                                  name="rating"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Rating (1-10)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter rating"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Additional Comments */}
                                <FormField
                                  control={form.control}
                                  name="additional_comments"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Additional Comments</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter comments"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {error && (
                          <div className="text-red-500 text-sm py-2">
                            {error}
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter>
                    <p className="text-center text-sm text-muted-foreground w-full">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => setActiveTab('login')}
                      >
                        Login
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showSuccess && <SuccessPopup message="Logged in successfully!" />}
    </div>
  );
}
