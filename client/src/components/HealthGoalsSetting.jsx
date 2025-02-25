import React, { useState } from 'react';
import { Target, Save, Loader2 } from 'lucide-react';
import { useHealthMetricsStore } from '../store/healthMetricsStore';

const HealthGoalsSetting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateMetric } = useHealthMetricsStore();
  const [goals, setGoals] = useState({
    weight: '',
    sleep: '',
    water: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await updateMetric(today, {
        goals: {
          weight: goals.weight ? Number(goals.weight) : undefined,
          sleep: goals.sleep ? Number(goals.sleep) : undefined,
          water: goals.water ? Number(goals.water) : undefined
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Health Goals
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Weight (lbs)
          </label>
          <input
            type="number"
            value={goals.weight}
            onChange={(e) => setGoals(prev => ({ ...prev, weight: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sleep Goal (hours)
          </label>
          <input
            type="number"
            value={goals.sleep}
            onChange={(e) => setGoals(prev => ({ ...prev, sleep: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Water Goal (cups)
          </label>
          <input
            type="number"
            value={goals.water}
            onChange={(e) => setGoals(prev => ({ ...prev, water: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="8"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Goals</span>
        </button>
      </div>
    </form>
  );
};

export default HealthGoalsSetting;