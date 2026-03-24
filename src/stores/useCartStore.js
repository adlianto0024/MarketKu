import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Import middleware persist

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      promo: {
        code: null,
        discount: 0,
        isActive: false
      },

      addToCart: (product) => set((state) => {
        const isExist = state.cartItems.find(item => item.id === product.id);
        if (isExist) {
          return {
            cartItems: state.cartItems.map(item => 
              item.id === product.id ? { ...item, qty: item.qty + product.qty } : item
            )
          };
        }
        return { cartItems: [...state.cartItems, product] };
      }),

      updateQty: (id, qty) => set((state) => ({
        cartItems: state.cartItems.map(item => 
          item.id === id ? { ...item, qty: Math.max(1, qty) } : item
        )
      })),

      removeItem: (id) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== id)
      })),

      applyPromo: (code) => set((state) => {
        if (code === "GABUTHEMAT") {
          return { 
            promo: { code: "GABUTHEMAT", discount: 0.1, isActive: true } 
          };
        }
        return state;
      }),

      removePromo: () => set({ 
        promo: { code: null, discount: 0, isActive: false } 
      })
    }),
    {
      name: 'cart-storage', // Nama kunci di Local Storage
    }
  )
);

export default useCartStore;