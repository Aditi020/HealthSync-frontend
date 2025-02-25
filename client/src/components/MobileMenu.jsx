import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Stethoscope,
  Calendar,
  Pill,
  BarChart2,
  Settings,
  X
} from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Stethoscope, label: 'Symptoms', path: '/symptoms' },
    { icon: Calendar, label: 'Journal', path: '/journal' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: BarChart2, label: 'Insights', path: '/insights' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40" />
      <div ref={menuRef} className="absolute inset-y-0 left-0 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === path
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;