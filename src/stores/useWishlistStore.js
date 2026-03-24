import { create } from 'zustand';

const useWishlistStore = create((set) => ({
    wishlistItems: [],

    toggleWishlist: (product) => set((state) => {
        const isExist = state.wishlistItems.some(item => item.id === product.id);

        if (isExist) {
            return { wishlistItems: state.wishlistItems.filter(item => item.id !== product.id) };
        }
        return { wishlistItems: [...state.wishlistItems, product] };
    }),

    setWishlist: (items) => set({ wishlistItems: items }),
    clearWishlist: () => set({ wishlistItems: [] })
}));

export default useWishlistStore;