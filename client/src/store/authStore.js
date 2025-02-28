import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useJournalStore } from './journalStore';
import { useMedicationStore } from './medicationStore';
import { useHealthMetricsStore } from './healthMetricsStore';
import { useSymptomStore } from './symptomStore';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async ({ name, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const existingUsers = get().users;

          if (existingUsers.some(user => user.email === email)) {
            throw new Error('Email already in use');
          }

          const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            password
          };

          set({
            users: [...existingUsers, newUser],
            user: newUser,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const users = get().users;
          const user = users.find(u => u.email === email && u.password === password);

          // Demo user access
          if (email === 'demo@example.com' && password === 'password') {
            set({
              user: { id: 'demo', name: 'Demo User', email: 'demo@example.com' },
              isAuthenticated: true,
              isLoading: false
            });
            // Reset all stores for demo user
            useMedicationStore.getState().resetMedications();
            useHealthMetricsStore.getState().resetMetrics();
            useJournalStore.getState().resetLogs();
            useSymptomStore.getState().resetSymptoms();
            return true;
          }

          if (!user) throw new Error('Invalid email or password');

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        // Clear all stores
        useJournalStore.getState().resetLogs();
        useMedicationStore.getState().resetMedications();
        useHealthMetricsStore.getState().resetMetrics();
        useSymptomStore.getState().resetSymptoms();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: localStorage, 
    }
  )
);
