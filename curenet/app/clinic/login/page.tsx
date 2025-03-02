// app/clinic/login/page.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {firestore} from '@/lib/firestore'
import { useAuthStore } from '@/lib/clinic_store'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function ClinicLoginPage() {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const { setUser, setProfile, setClinic } = useAuthStore()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  
  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    setGeneralError(null)
    
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password)
      const user = userCredential.user
      
      // Get user profile data
      const profile = await firestore.getClinicUser(user.uid)
      
      if (!profile) {
        throw new Error('User not found in the system')
      }
      
      // Get clinic data for clinic users
      let clinic = null
      if (profile.clinicId) {
        clinic = await firestore.getClinicById(profile.clinicId)
        if (!clinic) {
          throw new Error('Clinic not found')
        }
      }
      
      // Log user login
      await firestore.logClinicUserLogin(user.uid, '127.0.0.1') // Placeholder IP
      
      // Update stores
      setUser(user)
      setProfile(profile)
      setClinic(clinic)
      
      // Redirect to dashboard
      router.push('/clinic/dashboard')
      
    } catch (err: any) {
      console.error('Login error:', err)
      setGeneralError(err.message || 'Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md bg-card text-card-foreground border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Clinical Portal Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the clinical studies portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {generalError && (
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@clinic.com" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center pt-4">
          <p className="text-sm text-muted-foreground">
            Secure access to clinical studies - HIPAA Compliant
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}