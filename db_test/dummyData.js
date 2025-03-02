function reviveDate(_, value) {
    // Matches strings like "2022-08-25T09:39:19.288Z"
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

    return typeof value === 'string' && isoDateRegex.test(value) ? new Date(value) : value
}

const patientData = JSON.parse(`{
    "user_id": "toFwUumWAcUcvFsQ0JxNlYHONgD3",
    "name": "Ashley",
    "age": 34,
    "gender": "female",
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
    "participation": [
      {
        "studyId": "dK0BptAsYCuvxriOuE4S",
        "participation_start": "2023-02-01T00:00:00Z",
        "participation_end": "2023-05-01T00:00:00Z",
        "matched_criteria": [
          "age 30-40",
          "non-smoker"
        ],
        "patient_feedback": "Found the study informative",
        "rating": 8
      }
    ],
    "patient_symptoms": [
      "Shortness of breath",
      "Occasional wheezing"
    ],
    "additional_comments": [
      "Patient reports improved symptoms with medication",
      "Needs follow-up for asthma management"
    ]
  }`, reviveDate);

console.dir(patientData);

export default patientData;