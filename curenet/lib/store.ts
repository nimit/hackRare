import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from 'firebase/auth'
import type { PatientProfile } from './firebase-service.ts'

interface AuthState {
  user: User | null
  profile: PatientProfile | null
  setUser: (user: User | null) => void
  setProfile: (profile: PatientProfile | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () => set({ user: null, profile: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ profile: state.profile }), // Only persist profile
    }
  )
)