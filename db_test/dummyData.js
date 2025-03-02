function reviveDate(_, value) {
    // Matches strings like "2022-08-25T09:39:19.288Z"
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

    return typeof value === 'string' && isoDateRegex.test(value) ? new Date(value) : value
}

const patientData = JSON.parse(`{
    "id": "80TiGk8oNpZzioG6EDXc30btLLf2",
    "name": "Ashley",
    "age": 34,
    "gender": "female",
    "has_guardian": true,
    "height": [
      {
        "date": "2023-01-15T09:30:00Z",
        "value": 165
      }
    ],
    "family_history": [
      {
        "disease": "Diabetes",
        "relation": "father"
      },
      {
        "disease": "Hypertension",
        "relation": "mother"
      }
    ],
    "weight": [
      {
        "date": "2023-01-15T09:30:00Z",
        "value": 60
      }
    ],
    "heart_rate": [
      {
        "avg": 72,
        "min": 68,
        "max": 78,
        "time": "2023-01-15T09:30:00Z"
      }
    ],
    "blood_pressure": [
      {
        "low": 80,
        "high": 120,
        "time": "2023-01-15T09:30:00Z"
      }
    ],
    "diagnoses": [
      {
        "disease": "Asthma",
        "active": true,
        "severity": "mild"
      }
    ],
    "immunizations": [
      {
        "date": "2022-11-20T10:00:00Z",
        "vaccine": "Influenza"
      }
    ],
    "medications": [
      {
        "medicine": "Albuterol",
        "dosage": "2 puffs as needed",
        "start_date": "2023-01-01T00:00:00Z",
        "end_date": null,
        "side_effects": []
      }
    ],
    "allergies": [
      "Peanuts",
      "Penicillin"
    ],
    "genetic_abnormalities": [
      {
        "gene_affected": "BRCA1",
        "date_detected": "2021-05-10T00:00:00Z"
      }
    ],
    "approved_trials": [
      "EAXQpsJ9zkytvMrfZbP1"
    ],
    "participation": [
      {
        "trial_id": "gYvAzyT6w0P6E9eTwINS",
        "participation_start": "2023-02-01T00:00:00Z",
        "participation_end": "2023-05-01T00:00:00Z",
        "matched_criteria": [
          "age 30-40",
          "non-smoker"
        ],
        "patient_feedback": "Found the trial moderately successful",
        "rating": 8
      }
    ],
    "patient_symptoms": [
      "neuromuscular function tests"
    ],
    "additional_comments": [
      "Patient reports improved symptoms with medication",
      "Needs follow-up for asthma management"
    ]
  }`, reviveDate);

const trialData = JSON.parse(`{
  "NCTID": "NCT00543210",
  "trial_id": "gYvAzyT6w0P6E9eTwINS",
  "phase": "Phase III",
  "title": "Double-blind Study of 3,4-Diaminopyridine in Lambert-Eaton Myasthenic Syndrome",
  "brief_summary": "Evaluating the efficacy of 3,4-Diaminopyridine in improving neuromuscular transmission in LEMS patients.",
  "drug": "3,4-Diaminopyridine",
  "description": "This trial focuses on assessing the improvement in muscle strength and reduction in fatigue among patients with Lambert-Eaton Myasthenic Syndrome through administration of 3,4-Diaminopyridine.",
  "disease_targeted": "Lambert-Eaton Myasthenic Syndrome",
  "inclusion_criteria": [
    { "criterion": "Confirmed diagnosis of LEMS." },
    { "criterion": "Aged 18 and older." }
  ],
  "exclusion_criteria": [
    { "criterion": "History of cardiac arrhythmia." },
    { "criterion": "Recent use of immunosuppressive drugs." }
  ],
  "enrollment_capacity": 100,
  "sponsor": "Neuromuscular Research Group",
  "locations": [
    {
      "location_id": "LOC3004",
      "address": "101 Neurology Lane",
      "city": "New York",
      "state": "NY",
      "country": "USA"
    },
    {
      "location_id": "LOC3005",
      "address": "202 Science Park",
      "city": "Chicago",
      "state": "IL",
      "country": "USA"
    }
  ],
  "start_date": "2024-09-01T00:00:00Z",
  "end_date": "2026-09-01T00:00:00Z",
  "status": "completed",
  "contact_info": {
    "phone": "+1-212-555-0303",
    "email": "lemstrial@neuromusculargroup.org",
    "website": "https://www.neuromusculargroup.org/LEMS"
  },
  "data_security_details": "Patient information is encrypted in transit and at rest with access restricted to authorized personnel.",
  "study_results": [
    {
      "date": "2026-10-10T00:00:00Z",
      "result_summary": "Trial met primary endpoints with significant improvements in neuromuscular function.",
      "outcome": "positive"
    }
  ],
  "adverse_events": [
    {
      "date": "2025-11-15T00:00:00Z",
      "event_description": "Moderate headache and dizziness reported by several participants.",
      "severity": "moderate"
    },
    {
      "date": "2025-12-01T00:00:00Z",
      "event_description": "Severe allergic reaction in one patient, resolved after treatment.",
      "severity": "severe"
    }
  ],
  "created_at": "2024-08-20T08:00:00Z",
  "updated_at": "2026-10-11T09:30:00Z",
  "additional_comments": [
    "Study design included a double-blind placebo-controlled phase."
  ],
  "matching_criteria": [
    "neuromuscular function tests",
    "positive antibody test for VGCC"
  ]
}
`, reviveDate);

const clinicData = JSON.parse(`{
  "clinic_id": "XhzBW3QNfKphczfxYm17",
  "clinic_name": "RareCare Institute",
  "clinic_address": {
    "street": "101 Innovation Drive",
    "city": "Boston",
    "state": "MA",
    "zip_code": "02115",
    "country": "USA"
  },
  "contact_information": {
    "phone": "+1-617-555-0100",
    "email": "contact@rarecareinstitute.org"
  },
  "authorized_personnel": [
    {
      "personnel_id": "PCDp0Co7bOL9yiohLHtG",
      "name": "Jane Doe",
      "role": "Study Coordinator",
      "contact_phone": "+1-617-555-0122",
      "contact_email": "jane.doe@rarecareinstitute.org"
    }
  ],
  "clinical_studies": [
    "Yleg6i4pOxyjcqCleKDa",
    "EAXQpsJ9zkytvMrfZbP1",
    "gYvAzyT6w0P6E9eTwINS"
  ],
  "data_security": {
    "encryption_method": "AES-256",
    "last_security_audit": "2025-02-15T09:30:00Z",
    "audit_logs": [
      {
        "log_id": "log-101",
        "action": "data_access",
        "performed_by": "PCDp0Co7bOL9yiohLHtG",
        "timestamp": "2025-03-01T14:00:00Z",
        "details": "Accessed patient data for review."
      },
      {
        "log_id": "log-102",
        "action": "data_modification",
        "performed_by": "PCDp0Co7bOL9yiohLHtG",
        "timestamp": "2025-03-02T10:15:00Z",
        "details": "Updated contact information."
      }
    ]
  },
  "additional_comments": [
    "Clinic specializes in rare disease research.",
    "Recently expanded their clinical trials portfolio."
  ]
}
`, reviveDate);

const clinicUserData = JSON.parse(`{
    "user_id": "QM1S4tjLsrSGGi6N9CgRg4PhvaE2",
    "name": "Jane Doe",
    "role": "study_coordinator",
    "clinic_id": "XhzBW3QNfKphczfxYm17",
    "patients_managed": [
        "80TiGk8oNpZzioG6EDXc30btLLf2",
        "7cu8JSPM3KaEa1QmYY92xcClEkt2"
    ],
    "login_history": [
        {
            "timestamp": "2025-03-22T08:00:00Z",
            "ip_address": "117.40.33.11"
        }
    ],
    "last_hipaa_training": "2024-01-02T18:00:00Z"
}`, reviveDate);

export default {patientData, trialData, clinicData, clinicUserData};