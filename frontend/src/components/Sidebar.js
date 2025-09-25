import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Calendar,
  Database,
  FlaskConical,
  Train,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Zap,
  Droplets,
  FileCheck,
  Palette,
  Wrench,
  Clock
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout, getUserPages } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Get user-specific navigation based on role
  const getNavigation = () => {
    if (!user) return [];

    const allPages = {
      dashboard: { name: 'Dashboard', href: '/', icon: Home },
      planning: { name: 'Train Planning', href: '/planning', icon: Calendar },
      monitoring: { name: 'Train Monitoring', href: '/monitoring', icon: Train },
      'data-inputs': { name: 'Data Inputs', href: '/data-inputs', icon: Database },
      simulation: { name: 'Simulation', href: '/simulation', icon: FlaskConical },
      engine: { name: 'Engine Health', href: '/engine', icon: Zap },
      cleaning: { name: 'Compartment Cleaning', href: '/cleaning', icon: Droplets },
      certification: { name: 'Fitness Certificates', href: '/certification', icon: FileCheck },
      branding: { name: 'Branding Status', href: '/branding', icon: Palette },
      maintenance: { name: 'Maintenance Jobs', href: '/maintenance', icon: Wrench },
      service: { name: 'Service Intervals', href: '/service', icon: Clock }
    };

    const userPages = getUserPages();
    return userPages.map(page => allPages[page]).filter(Boolean);
  };

  const navigation = getNavigation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <Train className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MIP</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Metro Planner</p>
              </div>
            </div>
            {user && (
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)} // Close mobile menu on navigation
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 mr-3" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 mr-3" />
                  Dark Mode
                </>
              )}
            </button>

            {user && (
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                KMRL Metro Induction Planner
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                v2.0.0 - Role Based
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;