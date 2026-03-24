import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        name: 'Bell',
        email: 'widiblamblaem@gmail.com',
        phone: '62895343376001',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500',
        birthday: '',
        gender: ''
      },
      updateUser: (newData) => set((state) => ({
        user: { ...state.user, ...newData }
      })),
      
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // Data akan aman di localStorage meskipun di-refresh
    }
  )
);

export default useAuthStore;