import { create } from 'zustand';

const useWishlistStore = create((set) => ({
  // Sekarang menyimpan array objek produk
  wishlistItems: [], 
  
  // Update toggle agar menerima objek produk lengkap
  toggleWishlist: (product) => set((state) => {
    // Cek berdasarkan ID di dalam objek
    const isExist = state.wishlistItems.some(item => item.id === product.id); 
    
    if (isExist) {
      // Hapus jika sudah ada
      return { wishlistItems: state.wishlistItems.filter(item => item.id !== product.id) };
    }
    // Tambah objek lengkap jika belum ada
    return { wishlistItems: [...state.wishlistItems, product] };
  }),

  setWishlist: (items) => set({ wishlistItems: items }),
  clearWishlist: () => set({ wishlistItems: [] }) // Berguna saat logout
}));

export default useWishlistStore;