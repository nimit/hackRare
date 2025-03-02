const dummyData = {
    name: "John Doe",
    age: 42,
    gender: "male",
    height: [{ date: new Date("2023-01-15"), value: 175 }],
    weight: [{ date: new Date("2023-01-15"), value: 70 }],
    family_history: [{ disease: "Diabetes", relation: "Father" }],
    heart_rate: [{ avg: 72, min: 65, max: 90, time: new Date("2023-01-15") }],
    blood_pressure: [{ low: 70, high: 120, time: new Date("2023-01-15") }],
    diagnoses: [{ disease: "Ehlers-Danlos Syndrome", active: true, severity: "moderate" }],
    immunizations: [{ date: new Date("2023-01-15"), vaccine: "Influenza" }],
    medications: [
      {
        medicine: "Atenolol",
        dosage: "50mg daily",
        start_date: new Date("2022-06-01"),
        end_date: null,
        side_effects: ["Fatigue", "Dizziness"],
      },
    ],
    allergies: ["Penicillin", "Peanuts"],
    genetic_abnormalities: [{ gene_affected: "COL5A1", date_detected: new Date("2021-03-15") }],
    participation: [
      // {
      //   studyId: "EDS-2022-001",
      //   participation_start: new Date("2022-01-01"),
      //   participation_end: new Date("2022-06-30"),
      //   matched_criteria: ["Gene mutation", "Age group", "Symptom severity"],
      // },
    ],
    patient_feedback: "The last medication helped with joint pain but had side effects.",
    rating: 7,
    patient_symptoms: ["Joint hypermobility", "Skin hyperextensibility", "Chronic pain"],
    additional_comments: "Looking for clinical trials focused on pain management",
  }

export default {...dummyData};