import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Dummy user data for demonstration
const DEMO_USER = {
  id: 'user-1',
  name: 'John Smith',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces',
  preferences: {
    theme: 'light',
    notifications: true,
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Demo login - in real app this would validate against a backend
          if (email === 'demo@example.com' && password === 'password') {
            set({
              user: DEMO_USER,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          user: state.user
            ? {
              ...state.user,
              preferences: { ...state.user.preferences, ...preferences },
            }
            : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
