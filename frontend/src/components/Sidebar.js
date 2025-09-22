import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Train, 
  Database, 
  PlayCircle, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Settings
} from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Train Planning', href: '/planning', icon: Train },
    { name: 'Data Inputs', href: '/data-inputs', icon: Database },
    { name: 'Simulation', href: '/simulation', icon: PlayCircle },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-48'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Train className="h-8 w-8 text-metro-blue" />
            </div>
            <div className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                KMRL MIP
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Metro Induction Planner
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-metro-blue text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                      }`}
                    />
                    <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
