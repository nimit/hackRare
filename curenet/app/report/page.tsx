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
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Bell,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle,
  ChevronRight,
  X,
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

export default function ReportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    trialId: '',
    effectDate: '',
    effectTime: '',
    severity: '',
    description: '',
    symptoms: [] as string[],
    images: [] as File[],
    medicalAttention: false,
    medicationChanges: false,
    additionalNotes: '',
  });

  // List of trials the patient is participating in
  const participatingTrials = [
    {
      id: 'trial-001',
      title: 'Gene Therapy for Rare Metabolic Disorders',
      location: 'Johns Hopkins Hospital',
      startDate: '01/03/2023',
      status: 'Active',
    },
    {
      id: 'trial-002',
      title: 'Novel Treatment for Rare Neurological Conditions',
      location: 'Cleveland Clinic',
      startDate: '15/04/2023',
      status: 'Active',
    },
    {
      id: 'trial-003',
      title: 'Enzyme Replacement Study',
      location: 'Mayo Clinic',
      startDate: '10/01/2023',
      status: 'Completed',
    },
  ];

  // Common symptoms for selection
  const commonSymptoms = [
    'Headache',
    'Nausea',
    'Dizziness',
    'Fatigue',
    'Rash',
    'Fever',
    'Pain at injection site',
    'Muscle pain',
    'Joint pain',
    'Difficulty breathing',
    'Chest pain',
    'Allergic reaction',
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTrialSelect = (trialId: string) => {
    setSelectedTrial(trialId);
    setFormData({ ...formData, trialId });
    setStep(2);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const toggleSymptom = (symptom: string) => {
    if (formData.symptoms.includes(symptom)) {
      setFormData({
        ...formData,
        symptoms: formData.symptoms.filter((s) => s !== symptom),
      });
    } else {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptom],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting report:', formData);
    setShowSuccess(true);

    // Reset form after 2 seconds and show success message
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setSelectedTrial(null);
      setFormData({
        trialId: '',
        effectDate: '',
        effectTime: '',
        severity: '',
        description: '',
        symptoms: [],
        images: [],
        medicalAttention: false,
        medicationChanges: false,
        additionalNotes: '',
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar activePage="report" />

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                <h1 className="text-2xl font-bold">Report Adverse Effect</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search..."
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
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Report an Adverse Effect</CardTitle>
                      <CardDescription>
                        Use this form to report any adverse effects you've
                        experienced during a clinical trial. Your report will be
                        reviewed by the trial coordinator and medical team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-8">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            step >= 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          1
                        </div>
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        ></div>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            step >= 2
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          2
                        </div>
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            step >= 3 ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        ></div>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            step >= 3
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          3
                        </div>
                      </div>

                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <h3 className="text-lg font-medium mb-4">
                            Select a Trial
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Please select the clinical trial for which you want
                            to report an adverse effect.
                          </p>

                          <div className="space-y-4">
                            {participatingTrials.map((trial) => (
                              <motion.div
                                key={trial.id}
                                whileHover={{
                                  y: -2,
                                  transition: { duration: 0.2 },
                                }}
                                className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${
                                  selectedTrial === trial.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                                onClick={() => handleTrialSelect(trial.id)}
                              >
                                <div>
                                  <h4 className="font-medium">{trial.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {trial.location}
                                  </p>
                                  <div className="flex items-center mt-2">
                                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      Started: {trial.startDate}
                                    </span>
                                    <span
                                      className={`ml-3 text-xs px-2 py-1 rounded-full ${
                                        trial.status === 'Active'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      }`}
                                    >
                                      {trial.status}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <h3 className="text-lg font-medium mb-4">
                            Adverse Effect Details
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Please provide details about the adverse effect you
                            experienced.
                          </p>

                          <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="effectDate">
                                  Date of Occurrence
                                </Label>
                                <Input
                                  id="effectDate"
                                  type="date"
                                  value={formData.effectDate}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      effectDate: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="effectTime">
                                  Time of Occurrence
                                </Label>
                                <Input
                                  id="effectTime"
                                  type="time"
                                  value={formData.effectTime}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      effectTime: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="severity">Severity</Label>
                              <RadioGroup
                                value={formData.severity}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, severity: value })
                                }
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="mild"
                                    id="severity-mild"
                                  />
                                  <Label htmlFor="severity-mild">Mild</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="moderate"
                                    id="severity-moderate"
                                  />
                                  <Label htmlFor="severity-moderate">
                                    Moderate
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="severe"
                                    id="severity-severe"
                                  />
                                  <Label htmlFor="severity-severe">
                                    Severe
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="life-threatening"
                                    id="severity-life-threatening"
                                  />
                                  <Label htmlFor="severity-life-threatening">
                                    Life-threatening
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label>Symptoms (Select all that apply)</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {commonSymptoms.map((symptom) => (
                                  <div
                                    key={symptom}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`symptom-${symptom}`}
                                      checked={formData.symptoms.includes(
                                        symptom
                                      )}
                                      onCheckedChange={() =>
                                        toggleSymptom(symptom)
                                      }
                                    />
                                    <Label htmlFor={`symptom-${symptom}`}>
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">
                                Detailed Description
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Please describe the adverse effect in detail..."
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    description: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="medicalAttention"
                                  checked={formData.medicalAttention}
                                  onCheckedChange={(checked) =>
                                    setFormData({
                                      ...formData,
                                      medicalAttention: checked as boolean,
                                    })
                                  }
                                />
                                <Label htmlFor="medicalAttention">
                                  I sought medical attention for this effect
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="medicationChanges"
                                  checked={formData.medicationChanges}
                                  onCheckedChange={(checked) =>
                                    setFormData({
                                      ...formData,
                                      medicationChanges: checked as boolean,
                                    })
                                  }
                                />
                                <Label htmlFor="medicationChanges">
                                  I changed my medication due to this effect
                                </Label>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                              >
                                Back
                              </Button>
                              <Button type="button" onClick={() => setStep(3)}>
                                Next
                              </Button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <h3 className="text-lg font-medium mb-4">
                            Additional Information
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Please provide any additional information or images
                            that might help the medical team understand the
                            adverse effect.
                          </p>

                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="additionalNotes">
                                Additional Notes
                              </Label>
                              <Textarea
                                id="additionalNotes"
                                placeholder="Any additional information you'd like to share..."
                                className="min-h-[120px]"
                                value={formData.additionalNotes}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalNotes: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Upload Images (Optional)</Label>
                              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  id="image-upload"
                                  onChange={handleImageUpload}
                                />
                                <Label
                                  htmlFor="image-upload"
                                  className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                  <span className="text-sm font-medium">
                                    Click to upload images
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    PNG, JPG, GIF up to 10MB
                                  </span>
                                </Label>
                              </div>

                              {formData.images.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">
                                    Uploaded Images
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((image, index) => (
                                      <div
                                        key={index}
                                        className="relative group"
                                      >
                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                          <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Uploaded image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeImage(index)}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(2)}
                              >
                                Back
                              </Button>
                              <Button type="submit">Submit Report</Button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
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
              Report Submitted Successfully
            </DialogTitle>
            <DialogDescription>
              Thank you for reporting this adverse effect. The trial coordinator
              and medical team will review your report and may contact you for
              additional information.
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
