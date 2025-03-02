'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/footer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  ChevronRight,
  Info,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    trialId: '',
    appointmentDate: '',
    appointmentTime: '',
    preferredLocation: '',
    additionalNotes: '',
    agreeToTerms: false,
  });

  // Available time slots
  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
  ];

  // Trial locations
  const locations = [
    'Johns Hopkins Hospital - Main Campus',
    'Johns Hopkins Hospital - Bayview Medical Center',
    'Cleveland Clinic - Main Campus',
    'Mayo Clinic - Rochester',
    'Virtual Appointment',
  ];

  interface Trial {
    id: string;
    title: string;
    phase: string;
    duration: string;
    locations: string[];
    startDate: string;
    endDate: string;
    status: string;
    description: string;
    eligibility: string[];
    sponsor: string;
    coordinator: string;
    participantCount: number;
    image: string;
  }

  // Available trials
  const availableTrials: Trial[] = [
    {
      id: 'trial-001',
      title: 'Gene Therapy for Rare Metabolic Disorders',
      phase: 'Phase 2',
      duration: '12 months',
      locations: ['Johns Hopkins Hospital', 'Cleveland Clinic'],
      startDate: '01/07/2023',
      endDate: '30/06/2024',
      status: 'Recruiting',
      description:
        'This clinical trial is investigating a novel gene therapy approach for treating rare metabolic disorders. The study aims to evaluate the safety and efficacy of a single-dose gene therapy designed to address the underlying genetic cause of the condition.',
      eligibility: [
        'Confirmed diagnosis of specified rare metabolic disorder',
        'Age 18-65 years',
        'No prior gene therapy treatment',
        'Stable medical condition',
      ],
      sponsor: 'BioGenetics Research',
      coordinator: 'Dr. Sarah Johnson',
      participantCount: 45,
      image: '/images/gene-therapy.jpg',
    },
    {
      id: 'trial-002',
      title: 'Novel Treatment for Rare Neurological Conditions',
      phase: 'Phase 3',
      duration: '18 months',
      locations: ['Mayo Clinic', 'Cleveland Clinic'],
      startDate: '15/08/2023',
      endDate: '15/02/2025',
      status: 'Recruiting',
      description:
        'This study evaluates a new therapeutic approach for treating rare neurological conditions. The trial will assess the effectiveness of a novel compound in reducing symptoms and improving quality of life for patients with specific rare neurological disorders.',
      eligibility: [
        'Diagnosed with specified rare neurological condition',
        'Age 12-75 years',
        'No significant cardiac issues',
        'Able to complete all study visits',
      ],
      sponsor: 'NeuroInnovate Pharmaceuticals',
      coordinator: 'Dr. Michael Chen',
      participantCount: 120,
      image: '/images/neuro-treatment.jpg',
    },
    {
      id: 'trial-003',
      title: 'Enzyme Replacement Study for Lysosomal Storage Disorders',
      phase: 'Phase 2/3',
      duration: '24 months',
      locations: ['Johns Hopkins Hospital', 'Mayo Clinic'],
      startDate: '01/09/2023',
      endDate: '31/08/2025',
      status: 'Recruiting',
      description:
        'This clinical trial is studying a new enzyme replacement therapy for patients with specific lysosomal storage disorders. The study aims to determine if the treatment can safely and effectively reduce disease symptoms and improve organ function.',
      eligibility: [
        'Confirmed diagnosis of specified lysosomal storage disorder',
        'Age 5-80 years',
        'No prior organ transplantation',
        'Stable disease course for past 3 months',
      ],
      sponsor: 'EnzymeRx Therapeutics',
      coordinator: 'Dr. Emily Rodriguez',
      participantCount: 75,
      image: '/images/enzyme-therapy.jpg',
    },
  ];

  // My appointments
  const myAppointments = [
    {
      id: 'apt-001',
      trialId: 'trial-002',
      trialTitle: 'Novel Treatment for Rare Neurological Conditions',
      date: '22/06/2023',
      time: '10:30 AM',
      location: 'Cleveland Clinic - Main Campus',
      status: 'Upcoming',
      type: 'Initial Screening',
    },
    {
      id: 'apt-002',
      trialId: 'trial-001',
      trialTitle: 'Gene Therapy for Rare Metabolic Disorders',
      date: '15/05/2023',
      time: '02:00 PM',
      location: 'Johns Hopkins Hospital - Bayview Medical Center',
      status: 'Completed',
      type: 'Follow-up',
    },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTrialSelect = (trial: Trial) => {
    setSelectedTrial(trial);
    setFormData({ ...formData, trialId: trial.id });
    setStep(2);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setFormData({
        ...formData,
        appointmentDate: format(newDate, 'yyyy-MM-dd'),
      });
    }
  };

  const handleTimeSelect = (time: string) => {
    setTimeSlot(time);
    setFormData({ ...formData, appointmentTime: time });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking appointment:', formData);
    setShowSuccess(true);

    // Reset form after 2 seconds and show success message
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setSelectedTrial(null);
      setDate(undefined);
      setTimeSlot(undefined);
      setFormData({
        trialId: '',
        appointmentDate: '',
        appointmentTime: '',
        preferredLocation: '',
        additionalNotes: '',
        agreeToTerms: false,
      });
      setActiveTab('my-appointments');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar activePage="appointments" />

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
            >
              <h1 className="text-2xl font-bold">Appointments</h1>

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

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="available">
                        Available Trials
                      </TabsTrigger>
                      <TabsTrigger value="my-appointments">
                        My Appointments
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="available" className="space-y-6">
                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                          >
                            <div className="flex justify-between items-center">
                              <h2 className="text-xl font-semibold">
                                Available Clinical Trials
                              </h2>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Filter size={16} />
                                Filter
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {availableTrials.map((trial) => (
                                <motion.div
                                  key={trial.id}
                                  whileHover={{
                                    y: -5,
                                    transition: { duration: 0.2 },
                                  }}
                                  className="cursor-pointer"
                                  onClick={() => handleTrialSelect(trial)}
                                >
                                  <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                    <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                                      <div className="absolute top-2 right-2 z-10">
                                        <Badge className="bg-green-500 hover:bg-green-600">
                                          {trial.status}
                                        </Badge>
                                      </div>
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FileText size={48} />
                                      </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">
                                          {trial.title}
                                        </CardTitle>
                                      </div>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                        >
                                          {trial.phase}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                                        >
                                          {trial.duration}
                                        </Badge>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                        {trial.description}
                                      </p>
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin size={14} className="mr-1" />
                                        <span>
                                          {trial.locations.join(', ')}
                                        </span>
                                      </div>
                                    </CardContent>
                                    <CardFooter className="pt-0 flex justify-between items-center">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar
                                          size={14}
                                          className="inline mr-1"
                                        />
                                        {trial.startDate}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1"
                                      >
                                        View Details
                                        <ChevronRight size={16} />
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ) : step === 2 ? (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 p-0 h-auto"
                                onClick={() => setStep(1)}
                              >
                                <ArrowLeft size={14} />
                                Back to trials
                              </Button>
                              <span>/</span>
                              <span>Trial Details</span>
                            </div>

                            {selectedTrial && (
                              <>
                                <Card>
                                  <CardHeader>
                                    <CardTitle>{selectedTrial.title}</CardTitle>
                                    <CardDescription>
                                      Review trial details and book an
                                      appointment
                                    </CardDescription>
                                  </CardHeader>

                                  <CardContent>
                                    <div className="flex flex-col md:flex-row gap-6">
                                      <div className="md:w-2/3">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                          <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                          >
                                            {selectedTrial.phase}
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                          >
                                            {selectedTrial.status}
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                                          >
                                            {selectedTrial.duration}
                                          </Badge>
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                                          {selectedTrial.description}
                                        </p>

                                        <div className="space-y-4">
                                          <div>
                                            <h3 className="text-lg font-medium mb-2">
                                              Eligibility Criteria
                                            </h3>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                                              {selectedTrial.eligibility.map(
                                                (criteria, index) => (
                                                  <li key={index}>
                                                    {criteria}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>

                                          <div>
                                            <h3 className="text-lg font-medium mb-2">
                                              Trial Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div className="flex items-start">
                                                <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <div>
                                                  <p className="font-medium">
                                                    Trial Period
                                                  </p>
                                                  <p className="text-gray-600 dark:text-gray-400">
                                                    {selectedTrial.startDate} -{' '}
                                                    {selectedTrial.endDate}
                                                  </p>
                                                </div>
                                              </div>

                                              <div className="flex items-start">
                                                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <div>
                                                  <p className="font-medium">
                                                    Locations
                                                  </p>
                                                  <p className="text-gray-600 dark:text-gray-400">
                                                    {selectedTrial.locations.join(
                                                      ', '
                                                    )}
                                                  </p>
                                                </div>
                                              </div>

                                              <div className="flex items-start">
                                                <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <div>
                                                  <p className="font-medium">
                                                    Participants
                                                  </p>
                                                  <p className="text-gray-600 dark:text-gray-400">
                                                    {
                                                      selectedTrial.participantCount
                                                    }{' '}
                                                    enrolled
                                                  </p>
                                                </div>
                                              </div>

                                              <div className="flex items-start">
                                                <Info className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <div>
                                                  <p className="font-medium">
                                                    Sponsor
                                                  </p>
                                                  <p className="text-gray-600 dark:text-gray-400">
                                                    {selectedTrial.sponsor}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <h3 className="text-lg font-medium mb-4">
                                          Book an Appointment
                                        </h3>

                                        <div className="space-y-4">
                                          <div>
                                            <Label className="mb-2 block">
                                              Select a date
                                            </Label>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  className="w-full justify-start text-left font-normal"
                                                >
                                                  <Calendar className="mr-2 h-4 w-4" />
                                                  {date ? (
                                                    format(date, 'PPP')
                                                  ) : (
                                                    <span>Pick a date</span>
                                                  )}
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                  mode="single"
                                                  selected={date}
                                                  onSelect={handleDateSelect}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                          </div>

                                          <div>
                                            <Label className="mb-2 block">
                                              Preferred location
                                            </Label>
                                            <Select
                                              onValueChange={(value) =>
                                                setFormData({
                                                  ...formData,
                                                  preferredLocation: value,
                                                })
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {locations.map((location) => (
                                                  <SelectItem
                                                    key={location}
                                                    value={location}
                                                  >
                                                    {location}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <Button
                                            className="w-full"
                                            onClick={() => setStep(3)}
                                            disabled={
                                              !date ||
                                              !formData.preferredLocation
                                            }
                                          >
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </>
                            )}
                          </motion.div>
                        ) : (
                          step === 3 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6"
                            >
                              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 p-0 h-auto"
                                  onClick={() => setStep(2)}
                                >
                                  <ArrowLeft size={14} />
                                  Back to trial details
                                </Button>
                                <span>/</span>
                                <span>Complete Booking</span>
                              </div>

                              {selectedTrial && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      Complete Your Appointment Booking
                                    </CardTitle>
                                    <CardDescription>
                                      Please select a time slot and provide any
                                      additional information needed for your
                                      appointment.
                                    </CardDescription>
                                  </CardHeader>

                                  <CardContent>
                                    <form
                                      onSubmit={handleSubmit}
                                      className="space-y-6"
                                    >
                                      <div className="space-y-4">
                                        <div>
                                          <h3 className="text-lg font-medium mb-4">
                                            Appointment Summary
                                          </h3>
                                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                              <span className="text-gray-500 dark:text-gray-400">
                                                Trial:
                                              </span>
                                              <span className="font-medium">
                                                {selectedTrial.title}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-500 dark:text-gray-400">
                                                Date:
                                              </span>
                                              <span className="font-medium">
                                                {date
                                                  ? format(date, 'PPP')
                                                  : 'Not selected'}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-500 dark:text-gray-400">
                                                Location:
                                              </span>
                                              <span className="font-medium">
                                                {formData.preferredLocation}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <Label className="mb-2 block">
                                            Select a time slot
                                          </Label>
                                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                            {timeSlots.map((time) => (
                                              <Button
                                                key={time}
                                                type="button"
                                                variant={
                                                  timeSlot === time
                                                    ? 'default'
                                                    : 'outline'
                                                }
                                                className={`${
                                                  timeSlot === time
                                                    ? 'bg-blue-600 text-white'
                                                    : ''
                                                }`}
                                                onClick={() =>
                                                  handleTimeSelect(time)
                                                }
                                              >
                                                {time}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>

                                        <div>
                                          <Label htmlFor="additionalNotes">
                                            Additional Notes (Optional)
                                          </Label>
                                          <Textarea
                                            id="additionalNotes"
                                            placeholder="Any specific concerns or questions you have for the trial coordinator..."
                                            className="mt-1"
                                            value={formData.additionalNotes}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                additionalNotes: e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="flex items-start space-x-2 pt-4">
                                          <Checkbox
                                            id="terms"
                                            checked={formData.agreeToTerms}
                                            onCheckedChange={(checked) =>
                                              setFormData({
                                                ...formData,
                                                agreeToTerms:
                                                  checked as boolean,
                                              })
                                            }
                                          />
                                          <div className="grid gap-1.5 leading-none">
                                            <Label
                                              htmlFor="terms"
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              I agree to the terms and
                                              conditions
                                            </Label>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                              By booking this appointment, I
                                              understand that this is an initial
                                              screening and does not guarantee
                                              enrollment in the trial.
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex justify-end space-x-2 pt-4">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => setStep(2)}
                                        >
                                          Back
                                        </Button>
                                        <Button
                                          type="submit"
                                          disabled={
                                            !timeSlot || !formData.agreeToTerms
                                          }
                                        >
                                          Book Appointment
                                        </Button>
                                      </div>
                                    </form>
                                  </CardContent>
                                </Card>
                              )}
                            </motion.div>
                          )
                        )}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="my-appointments" className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                          My Appointments
                        </h2>
                      </div>

                      {myAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {myAppointments.map((appointment) => (
                            <Card
                              key={appointment.id}
                              className="overflow-hidden"
                            >
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                  <div
                                    className={`w-full md:w-2 ${
                                      appointment.status === 'Upcoming'
                                        ? 'bg-blue-500'
                                        : appointment.status === 'Completed'
                                        ? 'bg-green-500'
                                        : 'bg-gray-500'
                                    }`}
                                  ></div>
                                  <div className="p-4 flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                      <div>
                                        <h3 className="font-medium">
                                          {appointment.trialTitle}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {appointment.type}
                                        </p>
                                      </div>
                                      <Badge
                                        className={`mt-2 md:mt-0 ${
                                          appointment.status === 'Upcoming'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                            : appointment.status === 'Completed'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                        }`}
                                      >
                                        {appointment.status}
                                      </Badge>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm">
                                          {appointment.date}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm">
                                          {appointment.time}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm">
                                          {appointment.location}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-2">
                                      {appointment.status === 'Upcoming' && (
                                        <>
                                          <Button variant="outline" size="sm">
                                            Reschedule
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                          >
                                            Cancel
                                          </Button>
                                        </>
                                      )}
                                      {appointment.status === 'Completed' && (
                                        <Button variant="outline" size="sm">
                                          View Details
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No Appointments Yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                              You haven't booked any appointments for clinical
                              trials yet. Browse available trials to schedule
                              your first appointment.
                            </p>
                            <Button onClick={() => setActiveTab('available')}>
                              Browse Available Trials
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Appointment Booked Successfully
            </DialogTitle>
            <DialogDescription>
              Your appointment has been scheduled. You will receive a
              confirmation email with all the details shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
