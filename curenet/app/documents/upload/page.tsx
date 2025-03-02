'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessPopup } from '@/components/success-popup';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function DocumentsUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    // Mock upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would normally handle the actual file upload
    // For now, we'll just simulate a successful upload

    setIsUploading(false);
    setShowSuccess(true);
    setFile(null);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen>
        <div className="flex-1 flex">
          <DashboardSidebar activePage="documents" />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Upload EHR
                  </h1>
                  <p className="text-muted-foreground">
                    Upload your medical documents and records
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upload New Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                      id="document"
                      type="file"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />

      {showSuccess && (
        <SuccessPopup message="Document uploaded successfully!" />
      )}
    </div>
  );
}
