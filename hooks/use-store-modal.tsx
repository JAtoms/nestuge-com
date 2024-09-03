import {create} from 'zustand'

interface useStoredModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useStoreModal = create<useStoredModalStore>(
    (set) => ({
        isOpen: false,
        onOpen: () => set({isOpen: true}),
        onClose: () => set({isOpen: false})
    })
);