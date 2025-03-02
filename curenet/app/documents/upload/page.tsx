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
import { Label } from '@/components/ui/label';
import {
  Search,
  Bell,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Filter,
  Plus,
  Calendar,
  Clock,
  FileIcon,
  X,
  AlertCircle,
  MoreHorizontal,
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
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-documents');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  interface Document {
    id: string;
    name: string;
    type: string;
    category: string;
    size: string;
    uploadDate: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    trialId?: string;
    trialName?: string;
  }

  // Document categories
  const documentCategories = [
    { id: 'all', name: 'All Documents' },
    { id: 'medical', name: 'Medical Records' },
    { id: 'consent', name: 'Consent Forms' },
    { id: 'id', name: 'Identification' },
    { id: 'insurance', name: 'Insurance' },
    { id: 'lab', name: 'Lab Results' },
    { id: 'other', name: 'Other' },
  ];

  // Sample documents
  const documents: Document[] = [
    {
      id: 'doc-001',
      name: 'Medical History Summary.pdf',
      type: 'PDF',
      category: 'medical',
      size: '2.4 MB',
      uploadDate: '15/05/2023',
      status: 'Verified',
    },
    {
      id: 'doc-002',
      name: 'Consent Form - Gene Therapy Trial.pdf',
      type: 'PDF',
      category: 'consent',
      size: '1.8 MB',
      uploadDate: '20/05/2023',
      status: 'Verified',
      trialId: 'trial-001',
      trialName: 'Gene Therapy for Rare Metabolic Disorders',
    },
    {
      id: 'doc-003',
      name: 'Recent Blood Test Results.jpg',
      type: 'Image',
      category: 'lab',
      size: '3.2 MB',
      uploadDate: '01/06/2023',
      status: 'Verified',
    },
    {
      id: 'doc-004',
      name: 'Insurance Card.jpg',
      type: 'Image',
      category: 'insurance',
      size: '1.1 MB',
      uploadDate: '05/06/2023',
      status: 'Verified',
    },
    {
      id: 'doc-005',
      name: 'Genetic Test Results.pdf',
      type: 'PDF',
      category: 'lab',
      size: '4.7 MB',
      uploadDate: '10/06/2023',
      status: 'Pending',
    },
    {
      id: 'doc-006',
      name: 'ID Card.jpg',
      type: 'Image',
      category: 'id',
      size: '0.8 MB',
      uploadDate: '12/06/2023',
      status: 'Verified',
    },
  ];

  // Required documents
  const requiredDocuments = [
    {
      id: 'req-001',
      name: 'Government-issued ID',
      description: "Valid passport, driver's license, or national ID card",
      category: 'id',
      required: true,
    },
    {
      id: 'req-002',
      name: 'Medical Diagnosis Confirmation',
      description: 'Official document confirming your rare disease diagnosis',
      category: 'medical',
      required: true,
    },
    {
      id: 'req-003',
      name: 'Recent Lab Results',
      description:
        'Blood tests, genetic tests, or other relevant lab results from the past 6 months',
      category: 'lab',
      required: true,
    },
    {
      id: 'req-004',
      name: 'Insurance Information',
      description:
        'Copy of your current health insurance card (front and back)',
      category: 'insurance',
      required: true,
    },
    {
      id: 'req-005',
      name: 'Medical History Summary',
      description:
        'Summary of your medical history, including medications and treatments',
      category: 'medical',
      required: false,
    },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadDialog(false);
          setShowSuccessDialog(true);

          // Auto-close success dialog after 2 seconds
          setTimeout(() => {
            setShowSuccessDialog(false);
          }, 2000);

          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDeleteDocument = () => {
    // In a real app, you would delete the document here
    setShowDeleteDialog(false);

    // Show success message
    setShowSuccessDialog(true);
    setTimeout(() => {
      setShowSuccessDialog(false);
    }, 2000);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'Image':
        return <FileIcon className="h-10 w-10 text-blue-500" />;
      default:
        return <FileIcon className="h-10 w-10 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: 'Verified' | 'Pending' | 'Rejected') => {
    switch (status) {
      case 'Verified':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar activePage="documents" />

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
            >
              <h1 className="text-2xl font-bold">Documents</h1>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search documents..."
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
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Manage Your Documents
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Upload and manage documents required for clinical trial
                        participation
                      </p>
                    </div>

                    <Button
                      onClick={() => setShowUploadDialog(true)}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="my-documents">
                        My Documents
                      </TabsTrigger>
                      <TabsTrigger value="required-documents">
                        Required Documents
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="my-documents" className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 md:hidden"
                          >
                            <Search size={16} />
                            Search
                          </Button>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Showing {filteredDocuments.length} of{' '}
                          {documents.length} documents
                        </div>
                      </div>

                      {filteredDocuments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredDocuments.map((doc) => (
                            <motion.div
                              key={doc.id}
                              whileHover={{
                                y: -5,
                                transition: { duration: 0.2 },
                              }}
                            >
                              <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                <CardContent className="p-0">
                                  <div className="p-4 flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                      {getDocumentIcon(doc.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h3
                                            className="font-medium truncate"
                                            title={doc.name}
                                          >
                                            {doc.name}
                                          </h3>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {doc.size} • {doc.type}
                                          </p>
                                        </div>

                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                            >
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="cursor-pointer">
                                              <Eye className="h-4 w-4 mr-2" />
                                              View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                              <Download className="h-4 w-4 mr-2" />
                                              Download
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              className="cursor-pointer text-red-600 dark:text-red-400"
                                              onClick={() => {
                                                setSelectedDocument(doc);
                                                setShowDeleteDialog(true);
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>

                                      <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                          <Calendar className="h-3.5 w-3.5 mr-1" />
                                          {doc.uploadDate}
                                        </div>

                                        {getStatusBadge(doc.status)}
                                      </div>

                                      {doc.trialName && (
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                                          <span className="font-medium">
                                            Trial:
                                          </span>{' '}
                                          {doc.trialName}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No Documents Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                              {searchQuery
                                ? 'No documents match your search criteria. Try adjusting your filters.'
                                : "You haven't uploaded any documents yet. Click the button below to upload your first document."}
                            </p>
                            <Button onClick={() => setShowUploadDialog(true)}>
                              Upload Document
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="required-documents"
                      className="space-y-6"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Required Documents for Trial Participation
                          </CardTitle>
                          <CardDescription>
                            Please upload the following documents to complete
                            your profile and qualify for clinical trials
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {requiredDocuments.map((doc) => {
                              const uploaded = documents.some(
                                (d) =>
                                  d.category === doc.category &&
                                  d.status === 'Verified'
                              );

                              return (
                                <div
                                  key={doc.id}
                                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                  <div className="mb-4 md:mb-0 md:mr-4">
                                    <div className="flex items-start">
                                      <div className="mr-3 mt-1">
                                        {uploaded ? (
                                          <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                          </div>
                                        ) : (
                                          <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="font-medium flex items-center">
                                          {doc.name}
                                          {doc.required && (
                                            <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                              Required
                                            </Badge>
                                          )}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          {doc.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <Button
                                    variant={uploaded ? 'outline' : 'default'}
                                    size="sm"
                                    className={
                                      uploaded
                                        ? ''
                                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                                    }
                                    onClick={() => setShowUploadDialog(true)}
                                  >
                                    {uploaded ? (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                                        Uploaded
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                      </>
                                    )}
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to your profile. Supported formats: PDF, JPG,
              PNG.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories
                    .filter((c) => c.id !== 'all')
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trial">Related Trial (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select trial (if applicable)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial-001">
                    Gene Therapy for Rare Metabolic Disorders
                  </SelectItem>
                  <SelectItem value="trial-002">
                    Novel Treatment for Rare Neurological Conditions
                  </SelectItem>
                  <SelectItem value="trial-003">
                    Enzyme Replacement Study
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <Input type="file" className="hidden" id="file-upload" />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium">
                    Click to upload file
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PDF, JPG, PNG up to 10MB
                  </span>
                </Label>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              Delete Document
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="py-4 flex items-center space-x-3">
              {getDocumentIcon(selectedDocument.type)}
              <div>
                <p className="font-medium">{selectedDocument.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDocument.size} • Uploaded on{' '}
                  {selectedDocument.uploadDate}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocument}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Success
            </DialogTitle>
            <DialogDescription>
              Your document has been successfully{' '}
              {selectedDocument ? 'deleted' : 'uploaded'}.
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
