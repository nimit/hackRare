import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
  Timestamp,
  setDoc
} from "firebase/firestore"
import { db } from "./firebase"
import { UserProfile } from './clinic_store'

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


class FirestoreService {
  private static instance: FirestoreService

  private constructor() { }

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService()
    }
    return FirestoreService.instance
  }

  async newTrial(trial: any): Promise<boolean> {
    try {
      const docRef = doc(collection(db, "trials")); // Generate document reference with ID
      const trial_id = docRef.id;
      await setDoc(docRef, {...trial, trial_id});
      return true;
    } catch(error) {
      console.error('Error creating new trial', error)
      return false
    }
  }

  // Get user profile by auth ID (works for both patient and clinic users)
  async getClinicUser(userId: string): Promise<UserProfile | null> {
    try {
      // First try to find in clinic_users collection
      const clinicUsersRef = collection(db, 'clinic_users')
      const clinicUserQuery = query(clinicUsersRef, where('user_id', '==', userId))
      const clinicUserSnapshot = await getDocs(clinicUserQuery)

      if (!clinicUserSnapshot.empty) {
        const userData = clinicUserSnapshot.docs[0].data()
        return {
          userId: userData.user_id,
          name: userData.name,
          role: userData.role,
          clinicId: userData.clinic_id,
          patientsManaged: userData.patients_managed || [],
          lastHipaaTraining: (userData.last_hipaa_training as Timestamp).toDate(),
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Log user login
  async logClinicUserLogin(userId: string, ipAddress: string): Promise<void> {
    try {
      const usersRef = collection(db, 'clinic_users')
      const q = query(usersRef, where('user_id', '==', userId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        const userData = userDoc.data()

        const updatedLoginHistory = [...(userData.login_history || []), {
          timestamp: new Date(),
          ip_address: ipAddress
        }]

        await updateDoc(userDoc.ref, {
          login_history: updatedLoginHistory
        })
      }
    } catch (error) {
      console.error('Error logging user login:', error)
    }
  }

  // Get clinic by ID
  async getClinicById(clinicId: string): Promise<any | null> {
    try {
      const clinicDoc = await getDoc(doc(db, 'clinics', clinicId))

      if (!clinicDoc.exists()) {
        return null
      }

      return clinicDoc.data()
    } catch (error) {
      console.error('Error fetching clinic:', error)
      return null
    }
  }

  // Get patients managed by a specific clinic user
  async getPatientsManagedByUser(patientIds: string[]): Promise<PatientProfile[]> {
    if (!patientIds?.length) return []

    try {
      const patientsRef = collection(db, 'patients')
      const patients = []

      // Firestore doesn't support array queries with more than 10 items
      // so we'll batch the requests if needed
      const batchSize = 10
      for (let i = 0; i < patientIds.length; i += batchSize) {
        const batch = patientIds.slice(i, i + batchSize)
        const q = query(patientsRef, where('user_id', 'in', batch))
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach(doc => {
          patients.push(this.convertUserDoc(doc.data()))
        })
      }

      return patients
    } catch (error) {
      console.error('Error fetching patients:', error)
      return []
    }
  }

  // User Profile Methods
  async getUserProfile(userId: string): Promise<PatientProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "patients", userId))
      if (!userDoc.exists()) return null

      const data = userDoc.data()
      return this.convertUserDoc(data);
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

  private convertUserDoc(data: DocumentData): PatientProfile {
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

export const firestore = FirestoreService.getInstance()