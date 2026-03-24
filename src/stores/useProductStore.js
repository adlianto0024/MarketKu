import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  page: 1,
  hasMore: true,
  
  // Fungsi untuk memperbarui data
  setProducts: (newProducts) => set({ products: newProducts }),
  addProducts: (moreProducts) => set((state) => ({ 
    products: [...state.products, ...moreProducts] 
  })),
  setPage: (newPage) => set({ page: newPage }),
  setHasMore: (status) => set({ hasMore: status }),
  
  // Fungsi untuk reset (jika diperlukan saat pencarian baru)
  resetStore: () => set({ products: [], page: 1, hasMore: true })
}));

export default useProductStore;