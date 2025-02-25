import React from 'react';
import {
  AlertCircle,
  Calendar,
  Clock,
  ThermometerSun,
  Heart,
  Activity,
  Pill,
  Droplets,
  Scale,
  Smile,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '../store/journalStore';
import { useMedicationStore } from '../store/medicationStore';
import { useHealthMetricsStore } from '../store/healthMetricsStore';
import Banner from "../Banner.jpg";
import Hero_Image from "../Hero.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logs } = useJournalStore();
  const { medications, markAsTaken } = useMedicationStore();
  const { metrics } = useHealthMetricsStore();

  const today = new Date().toISOString().split('T')[0];
  const todayMetrics = metrics.find(m => m.date === today) || {
    temperature: '98.6',
    heartRate: '72',
    sleep: '7.5',
    weight: '150',
    water: 0,
    mood: 'good'
  };

  const getMoodTrend = (mood) => {
    if (['great', 'better', 'good'].includes(mood)) {
      return 'good';
    } else if (mood === 'okay') {
      return 'normal';
    } else if (['bad', 'worse'].includes(mood)) {
      return 'warning';
    }
    return 'normal'; // fallback
  };

  const upcomingMedications = medications
    .filter(med => {
      const nextDose = new Date(med.nextDose);
      return nextDose.toDateString() === new Date().toDateString();
    })
    .sort((a, b) => new Date(a.nextDose).getTime() - new Date(b.nextDose).getTime());

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Section with Semi-Blurry Background */}
      <section className="relative py-20 px-6 rounded-2xl overflow-hidden">
        {/* Semi-blurry background */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-50"
          style={{ backgroundImage: `url(${Banner})` }}
        />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to HealthSync</h1>
          <p className="text-xl mb-8">
            Your all-in-one health companion. Track symptoms, manage medications, and gain insights into your health.
          </p>
          <button
            onClick={() => navigate('/insights', { state: { showLogForm: true } })}
            className="flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Log Health Data</span>
          </button>
        </div>
      </section>

      {/* About HealthSync Section with Vector Image */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">About HealthSync</h2>
          <p className="text-gray-700 dark:text-gray-200">
            <strong className="text-blue-600 dark:text-blue-400">HealthSync</strong> is designed to help you take control of your health with ease and confidence.
            Whether you're <em className="text-blue-600 dark:text-blue-400">tracking symptoms</em>, managing medications, or analyzing health trends,
            < >HealthSync</> provides the tools you need to stay on top of your well-being.
            With a user-friendly interface and <em className="text-blue-600 dark:text-blue-400">smart insights</em>, it empowers you to make informed decisions about your health.
            <strong className="text-blue-600 dark:text-blue-400">Stay organized, stay informed, and take charge of your wellness journey</strong>
            with <strong className="text-blue-600 dark:text-blue-400">HealthSync</strong>.
          </p>

          <button
            onClick={() => navigate('/symptoms')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img
            src={Hero_Image} 
            alt="HealthSync Illustration"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickAction
          icon={AlertCircle}
          title="Check Symptoms"
          description="Analyze your symptoms"
          color="text-red-600"
          bgColor="bg-red-50 dark:bg-red-900/20"
          onClick={() => navigate('/symptoms')}
        />
        <QuickAction
          icon={Calendar}
          title="Health Journal"
          description="Log your daily health"
          color="text-blue-600"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => navigate('/journal')}
        />
        <QuickAction
          icon={Pill}
          title="Medications"
          description="Track your medicines"
          color="text-purple-600"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          onClick={() => navigate('/medications')}
        />
        <QuickAction
          icon={Activity}
          title="Health Insights"
          description="View your progress"
          color="text-green-600"
          bgColor="bg-green-50 dark:bg-green-900/20"
          onClick={() => navigate('/insights')}
        />
      </section>

      {/* Today's Overview Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Overview</h2>
          <button
            onClick={() => navigate('/insights', { state: { showLogForm: true } })}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Log Health Data</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <HealthMetric
            icon={ThermometerSun}
            label="Temperature"
            value={`${todayMetrics.temperature}°F`}
            trend="normal"
          />
          <HealthMetric
            icon={Heart}
            label="Heart Rate"
            value={`${todayMetrics.heartRate} bpm`}
            trend="normal"
          />
          <HealthMetric
            icon={Clock}
            label="Sleep"
            value={`${todayMetrics.sleep}h`}
            trend="good"
          />
          <HealthMetric
            icon={Scale}
            label="Weight"
            value={`${todayMetrics.weight} lbs`}
            trend="normal"
          />
          <HealthMetric
            icon={Droplets}
            label="Water Intake"
            value={`${todayMetrics.water} cups`}
            trend={todayMetrics.water >= 8 ? 'good' : 'warning'}
          />
          <HealthMetric
            icon={Smile}
            label="Mood"
            value={todayMetrics.mood.charAt(0).toUpperCase() + todayMetrics.mood.slice(1)}
            trend={getMoodTrend(todayMetrics.mood)}
          />
        </div>
      </section>

      {/* Upcoming Medications Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Medications</h2>
        <div className="space-y-4">
          {upcomingMedications.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No medications scheduled for today</p>
            </div>
          ) : (
            upcomingMedications.map((med) => (
              <MedicationReminder
                key={med.id}
                name={med.name}
                time={new Date(med.nextDose).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                dosage={med.dosage}
                onMarkTaken={() => markAsTaken(med.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const QuickAction = ({ icon: Icon, title, description, color, bgColor, onClick }) => (
  <button
    onClick={onClick}
    className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow text-left"
  >
    <div className={`${bgColor} ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </button>
);

const HealthMetric = ({ icon: Icon, label, value, trend }) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/20 rounded-xl">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className={`text-xs ${trend === 'good' ? 'text-green-600 dark:text-green-400' :
        trend === 'normal' ? 'text-blue-600 dark:text-blue-400' :
          'text-yellow-600 dark:text-yellow-400'
        }`}>
        {trend.charAt(0).toUpperCase() + trend.slice(1)}
      </p>
    </div>
  </div>
);

const MedicationReminder = ({ name, time, dosage, onMarkTaken }) => (
  <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700/20 rounded-xl">
    <div className="flex items-center space-x-4">
      <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
        <Pill className="h-6 w-6 text-purple-600" />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{dosage}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-lg font-semibold text-gray-900 dark:text-white">{time}</p>
      <button
        onClick={onMarkTaken}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      >
        Mark as taken
      </button>
    </div>
  </div>
);

export default Dashboard;