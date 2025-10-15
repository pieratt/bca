'use client'

import {create, StateCreator} from 'zustand'

export type ModalType = 'WAIT_LIST' | 'INQUIRY'

interface LayoutState {
  navVisible: boolean
  setNavVisible: (b: boolean) => void
  toggleNav: () => void
  activeModal?: ModalType
  setActiveModal: (activeModal?: ModalType) => void
}

const createModalsState: StateCreator<LayoutState> = (set) => ({
  navVisible: false,
  setNavVisible: (navVisible) => set({navVisible}),
  toggleNav: () => set((state) => ({navVisible: !state.navVisible})),
  setActiveModal: (activeModal) => set({activeModal}),
})

export const useLayout = create<LayoutState>(createModalsState)
