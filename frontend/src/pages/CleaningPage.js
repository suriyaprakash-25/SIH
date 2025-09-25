import React, { useState } from 'react';
import { 
  Droplets, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Save,
  SprayCan,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CleaningPage = () => {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [editMode, setEditMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [cleaningData, setCleaningData] = useState({
    interiorCleanliness: 85,
    exteriorWash: 'good',
    sanitization: 'completed',
    floorCondition: 'good',
    seatCondition: 'good',
    windowCleanliness: 92,
    wasteCollection: 'empty',
    airFreshener: 'good',
    lastCleaning: '2024-01-20T08:00:00',
    nextScheduled: '2024-01-21T06:00:00',
    cleaningStaff: 'Team A',
    checklist: {
      floors: true,
      seats: true,
      windows: true,
      handles: true,
      airVents: false,
      restrooms: true,
      doors: true
    }
  });

  const trains = [
    'KMRL-TS-01', 'KMRL-TS-02', 'KMRL-TS-03', 
    'KMRL-TS-04', 'KMRL-TS-05'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
      case 'completed':
      case 'empty':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
      case 'dirty':
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
      case 'completed':
      case 'empty':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'partial':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
      case 'dirty':
      case 'full':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const updateCleaningStatus = (field, value) => {
    setCleaningData(prev => ({
      ...prev,
      [field]: value
    }));
    setLastUpdate(new Date());
  };

  const updateChecklistItem = (item, checked) => {
    setCleaningData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: checked
      }
    }));
    setLastUpdate(new Date());
  };

  const saveChanges = async () => {
    try {
      console.log('Saving cleaning data for', selectedTrain, cleaningData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditMode(false);
      alert('Cleaning data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const getCompletionPercentage = () => {
    const checklist = cleaningData.checklist;
    const completed = Object.values(checklist).filter(Boolean).length;
    const total = Object.values(checklist).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compartment Cleaning</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  editMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {editMode ? 'Save Changes' : 'Edit Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Train Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Train</h2>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-3">
            {trains.map(train => (
              <button
                key={train}
                onClick={() => setSelectedTrain(train)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTrain === train
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {train}
              </button>
            ))}
          </div>
        </div>

        {/* Cleaning Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Interior Cleanliness */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <SprayCan className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-500">Interior Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {cleaningData.interiorCleanliness}%
            </div>
            {editMode && (
              <input
                type="range"
                min="0"
                max="100"
                value={cleaningData.interiorCleanliness}
                onChange={(e) => updateCleaningStatus('interiorCleanliness', parseInt(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* Window Cleanliness */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-500">Window Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {cleaningData.windowCleanliness}%
            </div>
            {editMode && (
              <input
                type="range"
                min="0"
                max="100"
                value={cleaningData.windowCleanliness}
                onChange={(e) => updateCleaningStatus('windowCleanliness', parseInt(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* Completion Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-500">Completion</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getCompletionPercentage()}%
            </div>
            <div className="text-xs text-gray-500">
              {Object.values(cleaningData.checklist).filter(Boolean).length} of {Object.values(cleaningData.checklist).length} tasks
            </div>
          </div>

          {/* Cleaning Staff */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-500">Assigned Team</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {cleaningData.cleaningStaff}
            </div>
            {editMode && (
              <select
                value={cleaningData.cleaningStaff}
                onChange={(e) => updateCleaningStatus('cleaningStaff', e.target.value)}
                className="w-full p-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="Team A">Team A</option>
                <option value="Team B">Team B</option>
                <option value="Team C">Team C</option>
              </select>
            )}
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Exterior Wash */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exterior Wash</h3>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm border ${getStatusColor(cleaningData.exteriorWash)}`}>
              {getStatusIcon(cleaningData.exteriorWash)}
              <span className="ml-2 capitalize">{cleaningData.exteriorWash}</span>
            </div>
            {editMode && (
              <select
                value={cleaningData.exteriorWash}
                onChange={(e) => updateCleaningStatus('exteriorWash', e.target.value)}
                className="mt-3 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="good">Good</option>
                <option value="warning">Needs Cleaning</option>
                <option value="dirty">Dirty</option>
              </select>
            )}
          </div>

          {/* Sanitization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sanitization</h3>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm border ${getStatusColor(cleaningData.sanitization)}`}>
              {getStatusIcon(cleaningData.sanitization)}
              <span className="ml-2 capitalize">{cleaningData.sanitization}</span>
            </div>
            {editMode && (
              <select
                value={cleaningData.sanitization}
                onChange={(e) => updateCleaningStatus('sanitization', e.target.value)}
                className="mt-3 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="completed">Completed</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
              </select>
            )}
          </div>

          {/* Waste Collection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Waste Collection</h3>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm border ${getStatusColor(cleaningData.wasteCollection)}`}>
              <Trash2 className="w-4 h-4" />
              <span className="ml-2 capitalize">{cleaningData.wasteCollection}</span>
            </div>
            {editMode && (
              <select
                value={cleaningData.wasteCollection}
                onChange={(e) => updateCleaningStatus('wasteCollection', e.target.value)}
                className="mt-3 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="empty">Empty</option>
                <option value="partial">Partially Full</option>
                <option value="full">Full</option>
              </select>
            )}
          </div>
        </div>

        {/* Cleaning Checklist */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cleaning Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(cleaningData.checklist).map(([item, checked]) => (
              <label key={item} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateChecklistItem(item, e.target.checked)}
                  disabled={!editMode}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {item.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {checked && <CheckCircle className="w-4 h-4 text-green-600" />}
              </label>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cleaning Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Cleaning
              </label>
              <input
                type="datetime-local"
                value={cleaningData.lastCleaning}
                onChange={(e) => updateCleaningStatus('lastCleaning', e.target.value)}
                disabled={!editMode}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Scheduled
              </label>
              <input
                type="datetime-local"
                value={cleaningData.nextScheduled}
                onChange={(e) => updateCleaningStatus('nextScheduled', e.target.value)}
                disabled={!editMode}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
          </div>

          {editMode && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveChanges}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleaningPage;