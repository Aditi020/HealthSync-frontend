import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [], // Store multiple users
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async ({ name, email, password }) => {
        set({ isLoading: true, error: null });

        try {
          const existingUsers = get().users;

          // Check if the email is already registered
          if (existingUsers.some((user) => user.email === email)) {
            throw new Error('Email already in use');
          }

          const newUser = { id: Date.now(), name, email, password };
          set({
            users: [...existingUsers, newUser], // Store new user
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const users = get().users;
          const user = users.find((u) => u.email === email && u.password === password);

          if (!user) {
            throw new Error('Invalid email or password');
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
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
    }),
    {
      name: 'auth-storage', // Saves data in localStorage
    }
  )
);
