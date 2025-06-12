import { create } from 'zustand'

interface SessionState {
  isExpiredDialogOpen: boolean
  openExpiredDialog: () => void
  closeExpiredDialog: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  isExpiredDialogOpen: false,
  openExpiredDialog: () => set({ isExpiredDialogOpen: true }),
  closeExpiredDialog: () => set({ isExpiredDialogOpen: false }),
}))
