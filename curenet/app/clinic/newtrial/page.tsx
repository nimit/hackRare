"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { firestore } from "@/lib/firestore";
import { SuccessPopup } from "@/components/success-popup";
import { ClinicNavbar } from "@/components/ClinicNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { FileText, Calendar, Users, MapPin, Phone, Mail, Globe, Shield, AlertCircle, ClipboardList } from "lucide-react";

interface TrialFormValues {
  NCTID: string;
  trial_id: string;
  phase: string;
  title: string;
  brief_summary: string;
  drug: string;
  description: string;
  disease_targeted: string;
  inclusion_criteria: string; // newline separated list
  exclusion_criteria: string; // newline separated list
  enrollment_capacity: number;
  sponsor: string;
  // For simplicity, we're handling one location in the form:
  location_id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  start_date: string; // using date input (YYYY-MM-DD)
  end_date: string; // using date input (YYYY-MM-DD)
  status: string;
  contact_phone: string;
  contact_email: string;
  contact_website: string;
  data_security_details: string;
  study_results: string; // JSON string for one result record (or an array)
  adverse_events: string; // JSON string for one adverse event record (or an array)
  additional_comments: string; // comma separated list
  matching_criteria: string; // comma separated list
}

const AddTrialPage = () => {
  const { register, handleSubmit, reset } = useForm<TrialFormValues>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showSuccess, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<TrialFormValues> = async (data) => {
    setLoading(true);
    // Build the trial object that matches your schema.
    // Note: In a production app you might want to use proper field arrays.
    const trial = {
      NCTID: data.NCTID,
      phase: data.phase,
      title: data.title,
      brief_summary: data.brief_summary,
      drug: data.drug,
      description: data.description,
      disease_targeted: data.disease_targeted,
      inclusion_criteria: data.inclusion_criteria
        .split("\n")
        .map((criterion) => ({ criterion: criterion.trim() }))
        .filter((item) => item.criterion),
      exclusion_criteria: data.exclusion_criteria
        .split("\n")
        .map((criterion) => ({ criterion: criterion.trim() }))
        .filter((item) => item.criterion),
      enrollment_capacity: data.enrollment_capacity,
      sponsor: data.sponsor,
      locations: [
        {
          location_id: data.location_id,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
        },
      ],
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
      status: data.status,
      contact_info: {
        phone: data.contact_phone,
        email: data.contact_email,
        website: data.contact_website,
      },
      data_security_details: data.data_security_details,
      study_results:
        // Parse the JSON string, or fall back to an empty array.
        JSON.parse(data.study_results || "[]"),
      adverse_events: JSON.parse(data.adverse_events || "[]"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      additional_comments: data.additional_comments
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      matching_criteria: data.matching_criteria
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };

    await firestore.newTrial(trial);
    setSuccess(true);
    setLoading(false);
    router.push("/clinic/dashboard");
  };

  const fillDummyData = () => {
    reset({
      NCTID: "NCT00001234",
      trial_id: "uuid-1234-5678-9012",
      phase: "Phase II",
      title: "Investigation of ABC Drug in Treatment of Rare Disease XYZ",
      brief_summary:
        "A brief overview of the clinical trial studying the efficacy of ABC drug.",
      drug: "ABC Drug",
      description:
        "Detailed description of trial objectives, methodology, and study design.",
      disease_targeted: "Rare Disease XYZ",
      inclusion_criteria:
        "Age between 18 and 65\nNo prior history of serious illness",
      exclusion_criteria: "History of heart disease\nPregnant or nursing",
      enrollment_capacity: 100,
      sponsor: "Health Clinic Inc.",
      location_id: "loc-001",
      address: "123 Main Street",
      city: "Metropolis",
      state: "NY",
      country: "USA",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      status: "recruiting",
      contact_phone: "123-456-7890",
      contact_email: "contact@healthclinic.com",
      contact_website: "https://www.healthclinic.com",
      data_security_details:
        "Encryption and access controls in place per HIPAA guidelines.",
      study_results: JSON.stringify([
        {
          date: new Date().toISOString(),
          result_summary: "Initial positive response observed.",
          outcome: "positive",
        },
      ]),
      adverse_events: JSON.stringify([
        {
          date: new Date().toISOString(),
          event_description: "Mild headache reported.",
          severity: "mild",
        },
      ]),
      additional_comments:
        "Patient follow-up required, Schedule next appointment",
      matching_criteria: "Genetic marker A, Symptom profile B",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <main className="flex-1 overflow-auto">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold">Add Clinical Trial</h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={fillDummyData}
              className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <FileText className="mr-2 h-4 w-4" />
              Fill with Sample Data
            </Button>
          </div>
        </motion.header>
        
        <div className="container mx-auto py-6 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Information */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Basic Trial Information
                      </CardTitle>
                      <CardDescription>
                        Enter the fundamental details about the clinical trial
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="NCTID">NCT ID</Label>
                          <Input
                            id="NCTID"
                            {...register("NCTID", { required: true })}
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            placeholder="NCT ID"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phase">Phase</Label>
                          <Select defaultValue="Phase II">
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                              <SelectValue placeholder="Select phase" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Phase I">Phase I</SelectItem>
                              <SelectItem value="Phase II">Phase II</SelectItem>
                              <SelectItem value="Phase III">Phase III</SelectItem>
                              <SelectItem value="Phase IV">Phase IV</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="phase"
                            {...register("phase", { required: true })}
                            className="hidden"
                            defaultValue="Phase II"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          {...register("title", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Clinical Trial Title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="brief_summary">Brief Summary</Label>
                        <Textarea
                          id="brief_summary"
                          {...register("brief_summary", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[100px]"
                          placeholder="A brief summary of the trial"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="drug">Drug/Treatment</Label>
                          <Input
                            id="drug"
                            {...register("drug", { required: true })}
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            placeholder="Drug Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="disease_targeted">Disease Targeted</Label>
                          <Input
                            id="disease_targeted"
                            {...register("disease_targeted", { required: true })}
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            placeholder="Disease or Condition"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description</Label>
                        <Textarea
                          id="description"
                          {...register("description", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[150px]"
                          placeholder="Detailed description of trial objectives, methodology, and study design"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ClipboardList className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                        Eligibility Criteria
                      </CardTitle>
                      <CardDescription>
                        Define who can participate in this clinical trial
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inclusion_criteria">
                          Inclusion Criteria (one per line)
                        </Label>
                        <Textarea
                          id="inclusion_criteria"
                          {...register("inclusion_criteria", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[150px]"
                          placeholder="Each line is an inclusion criterion"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="exclusion_criteria">
                          Exclusion Criteria (one per line)
                        </Label>
                        <Textarea
                          id="exclusion_criteria"
                          {...register("exclusion_criteria", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[150px]"
                          placeholder="Each line is an exclusion criterion"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="enrollment_capacity">Enrollment Capacity</Label>
                        <Input
                          id="enrollment_capacity"
                          type="number"
                          {...register("enrollment_capacity", {
                            required: true,
                            valueAsNumber: true,
                          })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Maximum number of participants"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        Location Details
                      </CardTitle>
                      <CardDescription>
                        Specify where the trial will take place
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location_id">Location ID</Label>
                            <Input
                              id="location_id"
                              {...register("location_id", { required: true })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              placeholder="Location ID"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sponsor">Sponsor</Label>
                            <Input
                              id="sponsor"
                              {...register("sponsor", { required: true })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              placeholder="Sponsor Name"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            {...register("address", { required: true })}
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            placeholder="Street Address"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              {...register("city", { required: true })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              {...register("state", { required: true })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              placeholder="State"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              {...register("country", { required: true })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column - Additional Information */}
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Timeline
                      </CardTitle>
                      <CardDescription>
                        Set the trial schedule and status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          type="date"
                          {...register("start_date", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          type="date"
                          {...register("end_date", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue="recruiting">
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_yet_recruiting">Not Yet Recruiting</SelectItem>
                            <SelectItem value="recruiting">Recruiting</SelectItem>
                            <SelectItem value="enrolling_by_invitation">Enrolling by Invitation</SelectItem>
                            <SelectItem value="active_not_recruiting">Active, Not Recruiting</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                            <SelectItem value="withdrawn">Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="status"
                          {...register("status", { required: true })}
                          className="hidden"
                          defaultValue="recruiting"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Phone className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Contact Information
                      </CardTitle>
                      <CardDescription>
                        How participants can reach out
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Phone</Label>
                        <Input
                          id="contact_phone"
                          {...register("contact_phone", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Contact Phone"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                          id="contact_email"
                          {...register("contact_email", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Contact Email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact_website">Website</Label>
                        <Input
                          id="contact_website"
                          {...register("contact_website", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Contact Website"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
                        Data Security
                      </CardTitle>
                      <CardDescription>
                        How participant data will be protected
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="data_security_details">Security Details</Label>
                        <Textarea
                          id="data_security_details"
                          {...register("data_security_details", { required: true })}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[100px]"
                          placeholder="Encryption and access controls in place per HIPAA guidelines"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="additional_comments">Additional Comments (comma separated)</Label>
                        <Input
                          id="additional_comments"
                          {...register("additional_comments")}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Comments, separated by commas"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="matching_criteria">Matching Criteria (comma separated)</Label>
                        <Input
                          id="matching_criteria"
                          {...register("matching_criteria")}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          placeholder="Criteria for matching patients, separated by commas"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="study_results">Study Results (JSON)</Label>
                        <Textarea
                          id="study_results"
                          {...register("study_results")}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[100px]"
                          placeholder="[]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="adverse_events">Adverse Events (JSON)</Label>
                        <Textarea
                          id="adverse_events"
                          {...register("adverse_events")}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[100px]"
                          placeholder="[]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/clinic/dashboard")}
                  className="border-gray-200 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {isLoading ? "Submitting..." : "Submit Trial"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      
      {showSuccess && <SuccessPopup message="Trial added successfully!" />}
    </div>
  );
};

export default AddTrialPage;
