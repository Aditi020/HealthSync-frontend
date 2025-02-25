import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useJournalStore = create(
  persist(
    (set) => ({
      logs: [],
      isLoading: false,
      error: null,

      // Reset action
      resetLogs: () => set({ logs: [], isLoading: false, error: null }),

      // Add a new log
      addLog: (log) => {
        const newLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          logs: [newLog, ...state.logs],
        }));
      },

      // Update an existing log
      updateLog: (id, updatedLog) => {
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === id ? { ...log, ...updatedLog } : log
          ),
        }));
      },

      // Delete a log
      deleteLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }));
      },

      // Get logs by date range
      getLogsByDateRange: (startDate, endDate) => {
        const { logs } = get();
        return logs.filter(
          (log) => log.date >= startDate && log.date <= endDate
        );
      },
    }),
    {
      name: 'health-journal-storage',
    }
  )
);