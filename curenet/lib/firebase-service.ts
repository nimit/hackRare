import { 
    doc, 
    getDoc, 
    getDocs, 
    collection, 
    query, 
    where, 
    limit,
    DocumentData,
    QueryDocumentSnapshot 
  } from "firebase/firestore"
  import { db } from "./firebase"
  
  export interface Trial {
    id: string
    title: string
    status: string
    phase: string
    condition: string
    location: string
    startDate: string
    description: string
    eligibility: string[]
    principalInvestigator: string
    institution: string
    totalParticipants: number
    duration: string
    interventions: string[]
    primaryOutcome: string
    secondaryOutcomes: string[]
    inclusionCriteria: string[]
    exclusionCriteria: string[]
    contacts: {
      name: string
      role: string
      email: string
      phone: string
    }[]
  }
  
  export interface PatientProfile {
    name: string
    age: number
    diagnoses: Array<{
      disease: string
      severity: string
    }>
    lastUpdated?: string
    email?: string
    height?: Array<{
      date: Date
      value: number
    }>
    weight?: Array<{
      date: Date
      value: number
    }>
    medications?: Array<{
      medicine: string
      dosage: string
      startDate: Date
      endDate?: Date
      sideEffects: string[]
    }>
  }
  
  class FirebaseService {
    private static instance: FirebaseService
    
    private constructor() {}
    
    public static getInstance(): FirebaseService {
      if (!FirebaseService.instance) {
        FirebaseService.instance = new FirebaseService()
      }
      return FirebaseService.instance
    }
  
    // User Profile Methods
    async getUserProfile(userId: string): Promise<PatientProfile | null> {
      try {
        const userDoc = await getDoc(doc(db, "patients", userId))
        if (!userDoc.exists()) return null
        
        const data = userDoc.data()
        return {
          name: data.name,
          age: data.age,
          diagnoses: data.diagnoses || [],
          lastUpdated: data.updatedAt?.toDate().toLocaleDateString(),
          email: data.email,
          height: data.height,
          weight: data.weight,
          medications: data.medications
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        throw error
      }
    }
  
    // Trial Methods
    async getApprovedTrials(n: number = 5): Promise<Trial[]> {
      try {
        const trialsQuery = query(
          collection(db, "trials"),
          where("status", "==", "approved"),
          limit(n)
        )
        
        const snapshot = await getDocs(trialsQuery)
        return snapshot.docs.map(this.convertTrialDoc)
      } catch (error) {
        console.error("Error fetching approved trials:", error)
        throw error
      }
    }
  
    async getTrialById(trialId: string): Promise<Trial | null> {
      try {
        const trialDoc = await getDoc(doc(db, "trials", trialId))
        if (!trialDoc.exists()) return null
        
        return this.convertTrialDoc(trialDoc)
      } catch (error) {
        console.error("Error fetching trial:", error)
        throw error
      }
    }
  
    async getMatchedTrials(userId: string, n: number = 5): Promise<Trial[]> {
      try {
        const userDoc = await getDoc(doc(db, "patients", userId))
        if (!userDoc.exists()) return []
  
        const userData = userDoc.data()
        const diagnoses = userData.diagnoses || []
        
        // Get trials matching user's conditions
        const trialsQuery = query(
          collection(db, "trials"),
          where("status", "==", "approved"),
          where("conditions", "array-contains-any", diagnoses.map(d => d.disease)),
          limit(n)
        )
        
        const snapshot = await getDocs(trialsQuery)
        return snapshot.docs.map(this.convertTrialDoc)
      } catch (error) {
        console.error("Error fetching matched trials:", error)
        throw error
      }
    }
  
    private convertTrialDoc(doc: QueryDocumentSnapshot<DocumentData>): Trial {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        status: data.status,
        phase: data.phase,
        condition: data.condition,
        location: data.location,
        startDate: data.startDate,
        description: data.description,
        eligibility: data.eligibility || [],
        principalInvestigator: data.principalInvestigator,
        institution: data.institution,
        totalParticipants: data.totalParticipants,
        duration: data.duration,
        interventions: data.interventions || [],
        primaryOutcome: data.primaryOutcome,
        secondaryOutcomes: data.secondaryOutcomes || [],
        inclusionCriteria: data.inclusionCriteria || [],
        exclusionCriteria: data.exclusionCriteria || [],
        contacts: data.contacts || []
      }
    }
  }
  
  export const firebaseService = FirebaseService.getInstance()