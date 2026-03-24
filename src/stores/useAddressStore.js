import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAddressStore = create(
  persist(
    (set) => ({
      addresses: [],

      addAddress: (address) => set((state) => {
        const isFirst = state.addresses.length === 0;
        const shouldBeMain = isFirst || address.isMain; // Hormati centang dari user

        let newAddresses = [...state.addresses];
        
        // Jika alamat baru ini diset utama, matikan status utama di alamat lain
        if (shouldBeMain) {
          newAddresses = newAddresses.map(addr => ({ ...addr, isMain: false }));
        }

        return {
          addresses: [...newAddresses, { ...address, id: Date.now(), isMain: shouldBeMain }]
        };
      }),

      updateAddress: (id, updatedData) => set((state) => {
        let newAddresses = [...state.addresses];
        
        // Jika diedit menjadi utama, matikan yang lain
        if (updatedData.isMain) {
          newAddresses = newAddresses.map(addr => ({ ...addr, isMain: false }));
        }

        return {
          addresses: newAddresses.map(addr => addr.id === id ? { ...addr, ...updatedData } : addr)
        };
      }),

      deleteAddress: (id) => set((state) => {
        const newAddresses = state.addresses.filter(addr => addr.id !== id);
        if (newAddresses.length > 0 && !newAddresses.some(addr => addr.isMain)) {
          newAddresses[0].isMain = true;
        }
        return { addresses: newAddresses };
      }),

      setMainAddress: (id) => set((state) => ({
        addresses: state.addresses.map(addr => ({
          ...addr,
          isMain: addr.id === id
        }))
      })),
    }),
    { name: 'address-storage' }
  )
);

export default useAddressStore;