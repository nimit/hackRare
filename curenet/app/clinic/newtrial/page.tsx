"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {useRouter} from "next/navigation";
import {firestore} from "@/lib/firestore";
import { SuccessPopup } from "@/components/success-popup";

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
  // For simplicity, we’re handling one location in the form:
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Clinical Trial</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium">NCTID</label>
          <Input
            {...register("NCTID", { required: true })}
            className="mt-1"
            placeholder="NCT ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phase</label>
          <Input
            {...register("phase", { required: true })}
            className="mt-1"
            placeholder="e.g., Phase II"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            {...register("title", { required: true })}
            className="mt-1"
            placeholder="Clinical Trial Title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Brief Summary</label>
          <Textarea
            {...register("brief_summary", { required: true })}
            className="mt-1"
            placeholder="A brief summary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Drug</label>
          <Input
            {...register("drug", { required: true })}
            className="mt-1"
            placeholder="Drug Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            {...register("description", { required: true })}
            className="mt-1"
            placeholder="Detailed description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Disease Targeted</label>
          <Input
            {...register("disease_targeted", { required: true })}
            className="mt-1"
            placeholder="Disease or Condition"
          />
        </div>

        {/* Criteria */}
        <div>
          <label className="block text-sm font-medium">
            Inclusion Criteria (one per line)
          </label>
          <Textarea
            {...register("inclusion_criteria", { required: true })}
            className="mt-1"
            placeholder="Each line is an inclusion criterion"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Exclusion Criteria (one per line)
          </label>
          <Textarea
            {...register("exclusion_criteria", { required: true })}
            className="mt-1"
            placeholder="Each line is an exclusion criterion"
          />
        </div>

        {/* Enrollment and Sponsor */}
        <div>
          <label className="block text-sm font-medium">
            Enrollment Capacity
          </label>
          <Input
            type="number"
            {...register("enrollment_capacity", {
              required: true,
              valueAsNumber: true,
            })}
            className="mt-1"
            placeholder="Enrollment Capacity"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sponsor</label>
          <Input
            {...register("sponsor", { required: true })}
            className="mt-1"
            placeholder="Sponsor Name"
          />
        </div>

        {/* Location Details */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Location Details</h2>
          <div>
            <label className="block text-sm font-medium">Location ID</label>
            <Input
              {...register("location_id", { required: true })}
              className="mt-1"
              placeholder="Location ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <Input
              {...register("address", { required: true })}
              className="mt-1"
              placeholder="Street Address"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <Input
                {...register("city", { required: true })}
                className="mt-1"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <Input
                {...register("state", { required: true })}
                className="mt-1"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <Input
                {...register("country", { required: true })}
                className="mt-1"
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        {/* Dates and Status */}
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <Input
            type="date"
            {...register("start_date", { required: true })}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <Input
            type="date"
            {...register("end_date", { required: true })}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <Input
            {...register("status", { required: true })}
            className="mt-1"
            placeholder="e.g., recruiting"
          />
        </div>

        {/* Contact Information */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <Input
              {...register("contact_phone", { required: true })}
              className="mt-1"
              placeholder="Phone Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              {...register("contact_email", { required: true })}
              className="mt-1"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Website</label>
            <Input
              {...register("contact_website", { required: true })}
              className="mt-1"
              placeholder="Website URL"
            />
          </div>
        </div>

        {/* Data Security and Outcomes */}
        <div>
          <label className="block text-sm font-medium">
            Data Security Details
          </label>
          <Textarea
            {...register("data_security_details", { required: true })}
            className="mt-1"
            placeholder="Describe security measures"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Study Results (JSON array)
          </label>
          <Textarea
            {...register("study_results", { required: true })}
            className="mt-1"
            placeholder='e.g., [{"date": "2025-01-01T00:00:00Z", "result_summary": "Summary", "outcome": "positive"}]'
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Adverse Events (JSON array)
          </label>
          <Textarea
            {...register("adverse_events", { required: true })}
            className="mt-1"
            placeholder='e.g., [{"date": "2025-01-01T00:00:00Z", "event_description": "Event", "severity": "mild"}]'
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Additional Comments (comma separated)
          </label>
          <Input
            {...register("additional_comments")}
            className="mt-1"
            placeholder="Comment1, Comment2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Matching Criteria (comma separated)
          </label>
          <Input
            {...register("matching_criteria")}
            className="mt-1"
            placeholder="Criteria1, Criteria2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button type="button" onClick={fillDummyData}>
            Fill with Dummy Details
          </Button>
          <Button type="submit">Submit Trial</Button>
        </div>
      </form>

      {showSuccess && <SuccessPopup message="New trial successful!" />}
    </div>
  );
};

export default AddTrialPage;
