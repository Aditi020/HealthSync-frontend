import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { Activity, Menu } from 'lucide-react';
import Navigation from './components/Navigation';
import MobileMenu from './components/MobileMenu';
import ProfileDropdown from './components/ProfileDropdown';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load all page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const HealthJournal = lazy(() => import('./pages/HealthJournal'));
const Medications = lazy(() => import('./pages/Medications'));
const Settings = lazy(() => import('./pages/Settings'));
const Insights = lazy(() => import('./pages/Insights'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-blue-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden -ml-1 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Activity className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                HealthSync
              </h1>
            </div>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route path="/journal" element={<HealthJournal />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="hidden md:block">
        <Navigation />
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;