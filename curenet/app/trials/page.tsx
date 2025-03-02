'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/footer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Bell,
  Calendar,
  MapPin,
  Users,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TrialsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample trials data
  const allTrials = [
    {
      id: 'trial-001',
      title: 'Gene Therapy for Rare Metabolic Disorders',
      phase: 'Phase 2',
      status: 'Recruiting',
      locations: ['Johns Hopkins Hospital', 'Cleveland Clinic'],
      startDate: '01/07/2023',
      endDate: '30/06/2024',
      participantCount: 45,
      description:
        'This clinical trial is investigating a novel gene therapy approach for treating rare metabolic disorders. The study aims to evaluate the safety and efficacy of a single-dose gene therapy.',
      matchScore: 92,
      disease: 'Metabolic',
    },
    {
      id: 'trial-002',
      title: 'Novel Treatment for Rare Neurological Conditions',
      phase: 'Phase 3',
      status: 'Recruiting',
      locations: ['Mayo Clinic', 'Cleveland Clinic'],
      startDate: '15/08/2023',
      endDate: '15/02/2025',
      participantCount: 120,
      description:
        'This study evaluates a new therapeutic approach for treating rare neurological conditions. The trial will assess the effectiveness of a novel compound in reducing symptoms.',
      matchScore: 87,
      disease: 'Neurological',
    },
    {
      id: 'trial-003',
      title: 'Enzyme Replacement Study for Lysosomal Storage Disorders',
      phase: 'Phase 2',
      status: 'Active',
      locations: ["Boston Children's Hospital", 'UCSF Medical Center'],
      startDate: '10/05/2023',
      endDate: '10/11/2024',
      participantCount: 35,
      description:
        'This trial is testing a new enzyme replacement therapy for patients with specific lysosomal storage disorders. The study focuses on safety, tolerability, and clinical efficacy.',
      matchScore: 95,
      disease: 'Metabolic',
    },
    {
      id: 'trial-004',
      title: 'Immunotherapy for Rare Autoimmune Disorders',
      phase: 'Phase 1',
      status: 'Recruiting',
      locations: ['Stanford Medical Center', 'NIH Clinical Center'],
      startDate: '01/09/2023',
      endDate: '01/03/2024',
      participantCount: 24,
      description:
        'A first-in-human study of a novel immunotherapy approach for rare autoimmune disorders. This trial will evaluate safety and preliminary efficacy of the treatment.',
      matchScore: 78,
      disease: 'Immunological',
    },
    {
      id: 'trial-005',
      title: 'Gene Editing Therapy for Rare Blood Disorders',
      phase: 'Phase 1/2',
      status: 'Recruiting',
      locations: ['Memorial Sloan Kettering', 'Dana-Farber Cancer Institute'],
      startDate: '15/10/2023',
      endDate: '15/04/2025',
      participantCount: 30,
      description:
        'This trial is evaluating a CRISPR-based gene editing approach for treating specific rare blood disorders. The study will assess safety and potential therapeutic benefit.',
      matchScore: 89,
      disease: 'Hematological',
    },
    {
      id: 'trial-006',
      title: 'Small Molecule Treatment for Rare Genetic Disorders',
      phase: 'Phase 3',
      status: 'Active',
      locations: [
        "Cincinnati Children's Hospital",
        "Children's Hospital of Philadelphia",
      ],
      startDate: '01/04/2023',
      endDate: '01/10/2024',
      participantCount: 150,
      description:
        'A pivotal trial of a small molecule therapy for specific rare genetic disorders. This study aims to confirm efficacy observed in earlier trials and support regulatory approval.',
      matchScore: 84,
      disease: 'Genetic',
    },
  ];

  // Filter trials based on search query and filters
  const filteredTrials = allTrials.filter((trial) => {
    const matchesSearch =
      trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.disease.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPhase =
      phaseFilter === 'all' || trial.phase.includes(phaseFilter);
    const matchesStatus =
      statusFilter === 'all' || trial.status === statusFilter;

    return matchesSearch && matchesPhase && matchesStatus;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar activePage="trials" />

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
            >
              <h1 className="text-2xl font-bold">Clinical Trials</h1>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search trials..."
                    className="pl-10 w-64 bg-gray-100 dark:bg-gray-700 border-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  className="space-y-6"
                >
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="relative md:hidden mb-4">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          placeholder="Search trials..."
                          className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-none"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <h2 className="text-xl font-semibold">
                        Available Clinical Trials
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {filteredTrials.length} trials found for your profile
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="w-40">
                        <Select
                          value={phaseFilter}
                          onValueChange={setPhaseFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Trial Phase" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Phases</SelectItem>
                            <SelectItem value="Phase 1">Phase 1</SelectItem>
                            <SelectItem value="Phase 1/2">Phase 1/2</SelectItem>
                            <SelectItem value="Phase 2">Phase 2</SelectItem>
                            <SelectItem value="Phase 3">Phase 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-40">
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Recruiting">
                              Recruiting
                            </SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Trials Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrials.map((trial) => (
                      <motion.div
                        key={trial.id}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Link href={`/trials/${trial.id}`}>
                          <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                            <div className="relative">
                              <div
                                className="h-3 bg-blue-500"
                                style={{ width: `${trial.matchScore}%` }}
                              ></div>
                              <div className="absolute top-3 right-3 z-10">
                                <Badge
                                  className={`
                                  ${
                                    trial.status === 'Recruiting'
                                      ? 'bg-green-500 hover:bg-green-600'
                                      : trial.status === 'Active'
                                      ? 'bg-blue-500 hover:bg-blue-600'
                                      : 'bg-gray-500 hover:bg-gray-600'
                                  }
                                `}
                                >
                                  {trial.status}
                                </Badge>
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
                                  {trial.disease}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                {trial.description}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <MapPin size={14} className="mr-1" />
                                <span className="truncate">
                                  {trial.locations.join(', ')}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Users size={14} className="mr-1" />
                                <span>
                                  {trial.participantCount} participants
                                </span>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between items-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <Calendar size={14} className="inline mr-1" />
                                {trial.startDate}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-1">
                                  {trial.matchScore}% match
                                </span>
                                <ChevronRight
                                  size={16}
                                  className="text-blue-600 dark:text-blue-400"
                                />
                              </div>
                            </CardFooter>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {filteredTrials.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Search className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No trials found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                        No clinical trials match your current search criteria.
                        Try adjusting your filters or search terms.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery('');
                          setPhaseFilter('all');
                          setStatusFilter('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
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
