// app/clinic/dashboard/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/clinic_store'
import { firestore, PatientProfile } from '@/lib/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function ClinicDashboardPage() {
  const { profile, clinic } = useAuthStore()
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Fetch managed patients
    const fetchPatients = async () => {
      if (profile?.patientsManaged?.length) {
        const patientData = await firestore.getPatientsManagedByUser(profile.patientsManaged)
        setPatients(patientData)
      }
      setLoading(false)
    }
    
    fetchPatients()
  }, [profile])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clinical Portal Dashboard</h1>
          <p className="text-gray-500">Welcome, {profile?.name || 'User'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{profile?.name ? getInitials(profile.name) : 'CU'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-medium">{clinic?.clinic_name || 'Clinic'}</p>
            <div className="text-sm text-gray-500">
              <Badge variant="outline" className="mr-1">{profile?.role || 'Staff'}</Badge>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="studies">Clinical Studies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Managed Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">
                  {patients.length === 1 ? 'Patient' : 'Patients'} under your care
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Studies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clinic?.clinical_studies?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {clinic?.clinical_studies?.length === 1 ? 'Study' : 'Studies'} in progress
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                  <div>
                <span className="text-md font-md text-slate-200">
                  {profile?.lastHipaaTraining ? 
                    `${profile.lastHipaaTraining.toLocaleString('default', {month: 'long'})} ${profile.lastHipaaTraining.getDate()},` : 
                    'Not available'} </span>
                <span className="text-sm font-small text-slate-500">
                  {profile?.lastHipaaTraining ? 
                    profile.lastHipaaTraining.getFullYear() : 
                    'Not available'} </span>
                </div>
                <p className="text-xs text-muted-foreground">Last training date</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="patients" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Managed Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No patients are currently assigned to you
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          <Badge>{'Active'}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="studies" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Studies</CardTitle>
            </CardHeader>
            <CardContent>
              {!clinic?.clinical_studies?.length ? (
                <div className="text-center py-6 text-gray-500">
                  No clinical studies are currently active
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clinic.clinical_studies.map((studyId: string, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-2">
                        <CardTitle className="text-md">Study ID: {studyId}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-500">
                          Study details will appear here
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}