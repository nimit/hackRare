// app/clinic/dashboard/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/clinic_store'
import { firestore, PatientProfile } from '@/lib/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClinicNavbar } from '@/components/ClinicNavbar'
import { Search, Bell, Clipboard, Activity, Calendar, Pill, AlertCircle, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
          >
            <h1 className="text-2xl font-bold">Clinical Portal Dashboard</h1>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search patients..."
                  className="pl-10 w-64 bg-gray-100 dark:bg-gray-700 border-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Avatar>
                  <AvatarFallback>{profile?.name ? getInitials(profile.name) : 'CU'}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium">{profile?.name || 'User'}</span>
              </motion.div>
            </div>
          </motion.header>

          <div className="container mx-auto py-6 px-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Clipboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Managed Patients
                        </h3>
                        <p className="text-2xl font-bold">{patients.length}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Active Studies
                        </h3>
                        <p className="text-2xl font-bold">{clinic?.clinical_studies?.length || 0}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Appointments
                        </h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                        <Pill className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          HIPAA Training
                        </h3>
                        <p className="text-2xl font-bold">
                          {profile?.lastHipaaTraining ? 
                            profile.lastHipaaTraining.getFullYear() : 
                            'N/A'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Your Managed Patients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {patients.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                              No patients are currently assigned to you
                            </div>
                          ) : (
                            patients.map((patient, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      {patient.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {patient.email}
                                    </p>
                                  </div>
                                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium px-2 py-1 rounded">
                                    Active
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                    Age: {patient.age}
                                  </span>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                        <div className="mt-4 text-center">
                          <Button variant="outline">
                            View All Patients
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Clinical Studies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!clinic?.clinical_studies?.length ? (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            No clinical studies are currently active
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {clinic.clinical_studies.map((studyId: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      Study ID: {studyId}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Study details will appear here
                                    </p>
                                  </div>
                                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium px-2 py-1 rounded">
                                    Active
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <span className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                                    Phase 2
                                  </span>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 text-center">
                          <Button variant="outline">
                            Add New Study
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Clinic Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Clinic Name
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {clinic?.clinic_name || 'Not available'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                              <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Your Role
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {profile?.role || 'Staff'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Compliance Reminders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                HIPAA Training Renewal
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {profile?.lastHipaaTraining ? 
                                  `Last completed: ${profile.lastHipaaTraining.toLocaleString('default', {month: 'long'})} ${profile.lastHipaaTraining.getFullYear()}` : 
                                  'Not completed'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mr-3">
                              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Patient Data Review
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Due in 14 days
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Study Protocol Review
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Due in 30 days
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}