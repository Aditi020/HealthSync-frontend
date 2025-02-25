import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BarChart2,
  Calendar,
  Filter,
  TrendingUp,
  Activity,
  Heart,
  Brain,
  Pill,
  ThermometerSun,
  Droplets,
  Scale,
  Moon,
  Smile,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Target
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { useJournalStore } from '../store/journalStore';
import { useMedicationStore } from '../store/medicationStore';
import { useHealthMetricsStore } from '../store/healthMetricsStore';
import HealthMetricsExport from '../components/HealthMetricsExport';
import HealthGoalsSetting from '../components/HealthGoalsSetting';

const moodEmojis = {
  great: "😃",
  better: "🙂",
  good: "😊",
  okay: "😐",
  bad: "😔",
  worse: "😢"
};

const getMoodDistributionData = (metrics) => {
  const moodCounts = metrics.reduce((acc, metric) => {
    const mood = metric.mood;
    if (!acc[mood]) {
      acc[mood] = 0;
    }
    acc[mood]++;
    return acc;
  }, {});

  return Object.keys(moodCounts).map((mood) => ({
    mood,
    count: moodCounts[mood],
  }));
};

const Insights = () => {
  const location = useLocation();
  const [dateRange, setDateRange] = useState('week');
  const [showLogForm, setShowLogForm] = useState(location.state?.showLogForm || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { logs } = useJournalStore();
  const { medications } = useMedicationStore();
  const { metrics, addMetric } = useHealthMetricsStore();

  const [healthLog, setHealthLog] = useState({
    date: new Date().toISOString().split('T')[0],
    temperature: '',
    heartRate: '',
    sleep: '',
    weight: '',
    water: '0',
    mood: 'good'
  });

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addMetric(healthLog);
      setSuccessMessage('Health data logged successfully');
      setShowLogForm(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log health data');
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    return { start, end };
  };

  const getHealthMetricsData = () => {
    const { start, end } = getDateRange();
    return metrics
      .filter(metric => {
        const date = new Date(metric.date);
        return date >= start && date <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateMovingAverage = (data, key, window = 3) => {
    return data.map((item, index) => {
      const start = Math.max(0, index - window + 1);
      const values = data.slice(start, index + 1).map(d => Number(d[key]));
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      return {
        ...item,
        [`${key}MA`]: average.toFixed(2)
      };
    });
  };

  const metricsData = getHealthMetricsData();
  const dataWithMA = calculateMovingAverage(metricsData, 'heartRate');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Health Insights
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <HealthMetricsExport />

          <button
            onClick={() => setShowLogForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Log Health Data</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <HealthGoalsSetting />
      </div>

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm flex items-center space-x-2">
          <span>{successMessage}</span>
        </div>
      )}

      {showLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Log Health Data
                </h3>
                <button
                  onClick={() => setShowLogForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={healthLog.date}
                    onChange={(e) => setHealthLog(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Temperature (°F)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={healthLog.temperature}
                      onChange={(e) => setHealthLog(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="98.6"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={healthLog.heartRate}
                      onChange={(e) => setHealthLog(prev => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="72"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sleep (hours)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={healthLog.sleep}
                      onChange={(e) => setHealthLog(prev => ({ ...prev, sleep: e.target.value }))}
                      placeholder="7.5"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={healthLog.weight}
                      onChange={(e) => setHealthLog(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="150"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Water Intake (cups)
                  </label>
                  <input
                    type="number"
                    value={healthLog.water}
                    onChange={(e) => setHealthLog(prev => ({ ...prev, water: e.target.value }))}
                    placeholder="8"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mood
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setHealthLog(prev => ({ ...prev, mood }))}
                        className={`py-2 rounded-lg border ${healthLog.mood === mood
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                          }`}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="block text-xs mt-1 capitalize">{mood}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowLogForm(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Temperature Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <ThermometerSun className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Temperature Trends
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getHealthMetricsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit="°F" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heart Rate Trends with Moving Average */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Heart Rate Trends
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataWithMA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit=" bpm" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Heart Rate"
                />
                <Line
                  type="monotone"
                  dataKey="heartRateMA"
                  stroke="#9f1239"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Moving Average"
                />
                <ReferenceLine y={72} stroke="#6b7280" strokeDasharray="3 3" label="Normal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Duration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Moon className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Sleep Duration
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getHealthMetricsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit="h" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Scale className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Weight Trends
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getHealthMetricsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit=" lbs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Intake */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Droplets className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Water Intake
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getHealthMetricsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit=" cups" />
                <Tooltip />
                <Bar dataKey="water" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Smile className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Mood Distribution
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getMoodDistributionData(metricsData)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#fbbf24"
                  name="Mood Count"
                  label={{ position: 'top' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;