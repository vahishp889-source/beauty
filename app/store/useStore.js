import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Custom storage that checks for window
const storage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(name, JSON.stringify(value));
      } catch (e) {
        // Ignore storage errors
      }
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(name);
      } catch (e) {
        // Ignore storage errors
      }
    }
  },
};

// Simulate confetti for SSR safety
const triggerConfetti = () => {
  if (typeof window !== 'undefined') {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#B76E79', '#E8B4B8', '#D4AF37'],
      });
    }).catch(() => {
      // Confetti not available
    });
  }
};

export const useStore = create(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      
      addToCart: (product, selectedShade = null, quantity = 1) => {
        const cart = get().cart;
        
        // Ensure shade is null if undefined or empty string
        const shade = selectedShade || null;
        
        // Find existing item with same _id and shade
        const existingIndex = cart.findIndex(
          item => item._id === product._id && item.selectedShade === shade
        );

        if (existingIndex > -1) {
          // Update quantity of existing item
          const newCart = [...cart];
          newCart[existingIndex].quantity += quantity;
          set({ cart: newCart });
        } else {
          // Add new item to cart
          const newItem = {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            images: product.images || [],
            selectedShade: shade,
            quantity: quantity,
          };
          set({ cart: [...cart, newItem] });
        }
        
        // Show confetti on add
        triggerConfetti();
      },
      
      removeFromCart: (productId, shade = null) => {
        set({
          cart: get().cart.filter(
            item => !(item._id === productId && item.selectedShade === shade)
          ),
        });
      },
      
      updateQuantity: (productId, shade = null, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId, shade);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item._id === productId && item.selectedShade === shade
              ? { ...item, quantity }
              : item
          ),
        });
      },
      
      clearCart: () => set({ cart: [] }),

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        if (!get().wishlist.includes(productId)) {
          set({ wishlist: [...get().wishlist, productId] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter(id => id !== productId) });
      },

      // User
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        const viewed = get().recentlyViewed.filter(p => p._id !== product._id);
        set({ recentlyViewed: [product, ...viewed].slice(0, 10) });
      },

      // Cart Total in INR
      getCartTotal: () => {
        const exchangeRate = 83.5;
        return get().cart.reduce((total, item) => {
          return total + (item.price * exchangeRate * item.quantity);
        }, 0);
      },
      
      // Cart Total in USD
      getCartTotalUSD: () => {
        return get().cart.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },

      // Get cart count
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'beauty-store',
      storage: createJSONStorage(() => storage),
      skipHydration: true,
    }
  )
);

// Hydration helper
export const hydrateStore = () => {
  if (typeof window !== 'undefined') {
    useStore.persist.rehydrate();
  }
};
