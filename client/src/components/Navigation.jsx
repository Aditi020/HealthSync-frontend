import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Stethoscope, Calendar, Pill, BarChart2 } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Stethoscope, label: 'Symptoms', path: '/symptoms' },
    { icon: Calendar, label: 'Journal', path: '/journal' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: BarChart2, label: 'Insights', path: '/insights' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between py-3">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center space-y-1 group ${location.pathname === path
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              <Icon className={`h-6 w-6 ${location.pathname === path
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;