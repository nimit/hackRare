// lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from 'firebase/auth'

// Define a unified user profile type
export type UserProfile = {
  userId: string
  name: string
  role: string
  clinicId: string
  patientsManaged: string[]
  lastHipaaTraining: Date,
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  clinic: any | null // Type this properly based on your clinic schema
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setClinic: (clinic: any | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      clinic: null,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setClinic: (clinic) => set({ clinic }),
      clearAuth: () => set({ user: null, profile: null, clinic: null }),
    }),
    {
      name: 'clinic-auth-storage',
      partialize: (state) => ({ profile: state.profile, clinic: state.clinic }),
    }
  )
)