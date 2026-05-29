import { create } from 'zustand'
import { FLAVORS } from '../constants/flavors'

export const useFlavorStore = create((set) => ({
  activeFlavor: FLAVORS[0],
  setFlavor: (flavor) => set({ activeFlavor: flavor }),
  cycleNext: () =>
    set((state) => {
      const idx = FLAVORS.findIndex((f) => f.id === state.activeFlavor.id)
      return { activeFlavor: FLAVORS[(idx + 1) % FLAVORS.length] }
    }),
}))
