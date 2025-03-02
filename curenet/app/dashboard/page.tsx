'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Activity,
  Search,
  Bell,
  Calendar,
  FileText,
  Pill,
  Clipboard,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import Link from 'next/link';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Trial status data
  const trialStatusData = {
    labels: ['Applied', 'Screening', 'Enrolled', 'Completed'],
    datasets: [
      {
        data: [4, 2, 1, 3],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Disease categories data
  const diseaseCategoriesData = {
    labels: ['Neurological', 'Metabolic', 'Immunological', 'Genetic'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      title: 'Initial Screening',
      location: 'Mayo Clinic',
      date: '15/06/23',
      time: '10:30 AM',
    },
    {
      id: 2,
      title: 'Follow-up Consultation',
      location: 'Virtual Meeting',
      date: '22/06/23',
      time: '02:00 PM',
    },
  ];

  // Recommended trials
  const recommendedTrials = [
    {
      id: 1,
      title: 'Gene Therapy for Rare Metabolic Disorders',
      match: '92%',
      location: 'Johns Hopkins Hospital',
      status: 'Recruiting',
    },
    {
      id: 2,
      title: 'Novel Treatment for Rare Neurological Conditions',
      match: '87%',
      location: 'Cleveland Clinic',
      status: 'Recruiting',
    },
    {
      id: 3,
      title: 'Enzyme Replacement Study',
      match: '78%',
      location: 'Mayo Clinic',
      status: 'Recruiting',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar activePage="dashboard" />

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
            >
              <h1 className="text-2xl font-bold">Patient Dashboard</h1>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search trials..."
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
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium">John Doe</span>
                </motion.div>
              </div>
            </motion.header>

            <div className="container mx-auto py-6 px-4">
              {isLoading ? (
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
                            Total Trials
                          </h3>
                          <p className="text-2xl font-bold">10</p>
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
                            Active Trials
                          </h3>
                          <p className="text-2xl font-bold">3</p>
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
                          <p className="text-2xl font-bold">2</p>
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
                            Medications
                          </h3>
                          <p className="text-2xl font-bold">5</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recommended Clinical Trials</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recommendedTrials.map((trial, index) => (
                              <motion.div
                                key={trial.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      {trial.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {trial.location}
                                    </p>
                                  </div>
                                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium px-2 py-1 rounded">
                                    {trial.match} Match
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                    {trial.status}
                                  </span>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <Button variant="outline">
                              View All Available Trials
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Upcoming Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {upcomingAppointments.map((appointment, index) => (
                              <motion.div
                                key={appointment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        {appointment.title}
                                      </h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {appointment.location}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {appointment.date}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {appointment.time}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <Link
                              href="/appointments"
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <Button variant="outline">
                                Schedule New Appointment
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Trial Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-center mb-6">
                            <div className="relative w-48 h-48">
                              <Doughnut data={trialStatusData} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                              <span>Applied (4)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                              <span>Screening (2)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span>
                              <span>Enrolled (1)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                              <span>Completed (3)</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Disease Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-center mb-6">
                            <div className="relative w-48 h-48">
                              <Pie data={diseaseCategoriesData} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                              <span>Neurological (35%)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                              <span>Metabolic (25%)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                              <span>Immunological (20%)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span>
                              <span>Genetic (20%)</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Health Reminders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Submit weekly symptom journal
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Due in 2 days
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mr-3">
                                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Refill medication prescription
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Due in 5 days
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Update medical history
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Due in 7 days
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
      </SidebarProvider>
      <Footer />
    </div>
  );
}
