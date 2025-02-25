import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHealthMetricsStore = create(
  persist(
    (set) => ({
      metrics: [],

      // Reset action
      resetMetrics: () => set({ metrics: [] }),

      // Add a new metric
      addMetric: (metric) => {
        set((state) => ({
          metrics: [
            ...state.metrics.filter((m) => m.date !== metric.date),
            metric,
          ],
        }));
      },

      // Update an existing metric
      updateMetric: (date, updates) => {
        set((state) => ({
          metrics: state.metrics.map((metric) =>
            metric.date === date ? { ...metric, ...updates } : metric
          ),
        }));
      },

      // Get metrics by date range
      getMetricsByDateRange: (startDate, endDate) => {
        return get().metrics.filter(
          (metric) => metric.date >= startDate && metric.date <= endDate
        );
      },

      // Export metrics
      exportMetrics: (format) => {
        const metrics = get().metrics;
        if (format === 'csv') {
          const headers = ['Date', 'Temperature', 'Heart Rate', 'Sleep', 'Weight', 'Water', 'Mood'];
          const rows = metrics.map(m => [
            m.date,
            m.temperature,
            m.heartRate,
            m.sleep,
            m.weight,
            m.water,
            m.mood
          ]);
          return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        return JSON.stringify(metrics, null, 2);
      },

      // Calculate trends
      calculateTrends: (metric, days) => {
        const metrics = get().metrics;
        const now = new Date();
        const startDate = new Date(now.setDate(now.getDate() - days));

        const relevantMetrics = metrics
          .filter(m => new Date(m.date) >= startDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (relevantMetrics.length < 2) return 0;

        const first = Number(relevantMetrics[0][metric]);
        const last = Number(relevantMetrics[relevantMetrics.length - 1][metric]);

        return ((last - first) / first) * 100;
      },
    }),
    {
      name: 'health-metrics-storage',
    }
  )
);