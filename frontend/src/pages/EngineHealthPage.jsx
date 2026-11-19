import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Save,
  Battery,
  Gauge,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EngineHealthPage = () => {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [trainData, setTrainData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Engine health specific data
  const [engineData, setEngineData] = useState({
    motorEfficiency: 94,
    brakeStatus: 'good',
    electricalSystems: 'good',
    batteryLevel: 87,
    temperature: 42,
    vibrationLevel: 'normal',
    oilPressure: 45,
    fuelConsumption: 12.5,
    lastMaintenance: '2024-01-15',
    nextService: '2024-02-15',
    runningHours: 2847,
    faultCodes: []
  });

  const trains = [
    'KMRL-TS-01', 'KMRL-TS-02', 'KMRL-TS-03', 
    'KMRL-TS-04', 'KMRL-TS-05'
  ];

  useEffect(() => {
    loadTrainData();
  }, [selectedTrain]);

  const loadTrainData = async () => {
    try {
      // Simulate API call - in real app, fetch from backend
      setTrainData({
        id: selectedTrain,
        status: Math.random() > 0.3 ? 'operational' : 'maintenance',
        location: 'Station B',
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading train data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
      case 'operational':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
      case 'maintenance':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const updateEngineStatus = (field, value) => {
    setEngineData(prev => ({
      ...prev,
      [field]: value
    }));
    setLastUpdate(new Date());
  };

  const saveChanges = async () => {
    try {
      // In real app, send to backend API
      console.log('Saving engine data for', selectedTrain, engineData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditMode(false);
      alert('Engine health data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Engine Health Monitor</h1>
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
            <button
              onClick={loadTrainData}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
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

        {/* Engine Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Motor Efficiency */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Battery className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-500">Motor Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {engineData.motorEfficiency}%
            </div>
            {editMode && (
              <input
                type="range"
                min="0"
                max="100"
                value={engineData.motorEfficiency}
                onChange={(e) => updateEngineStatus('motorEfficiency', parseInt(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* Battery Level */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Battery className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-500">Battery Level</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {engineData.batteryLevel}%
            </div>
            {editMode && (
              <input
                type="range"
                min="0"
                max="100"
                value={engineData.batteryLevel}
                onChange={(e) => updateEngineStatus('batteryLevel', parseInt(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* Temperature */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Gauge className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-500">Temperature</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {engineData.temperature}°C
            </div>
            {editMode && (
              <input
                type="number"
                value={engineData.temperature}
                onChange={(e) => updateEngineStatus('temperature', parseInt(e.target.value))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          </div>

          {/* Running Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-500">Running Hours</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {engineData.runningHours}h
            </div>
            {editMode && (
              <input
                type="number"
                value={engineData.runningHours}
                onChange={(e) => updateEngineStatus('runningHours', parseInt(e.target.value))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Brake System */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Brake System</h3>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm border ${getStatusColor(engineData.brakeStatus)}`}>
              {getStatusIcon(engineData.brakeStatus)}
              <span className="ml-2 capitalize">{engineData.brakeStatus}</span>
            </div>
            {editMode && (
              <select
                value={engineData.brakeStatus}
                onChange={(e) => updateEngineStatus('brakeStatus', e.target.value)}
                className="mt-3 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            )}
          </div>

          {/* Electrical Systems */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Electrical Systems</h3>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm border ${getStatusColor(engineData.electricalSystems)}`}>
              {getStatusIcon(engineData.electricalSystems)}
              <span className="ml-2 capitalize">{engineData.electricalSystems}</span>
            </div>
            {editMode && (
              <select
                value={engineData.electricalSystems}
                onChange={(e) => updateEngineStatus('electricalSystems', e.target.value)}
                className="mt-3 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            )}
          </div>
        </div>

        {/* Service Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Maintenance
              </label>
              <input
                type="date"
                value={engineData.lastMaintenance}
                onChange={(e) => updateEngineStatus('lastMaintenance', e.target.value)}
                disabled={!editMode}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Service
              </label>
              <input
                type="date"
                value={engineData.nextService}
                onChange={(e) => updateEngineStatus('nextService', e.target.value)}
                disabled={!editMode}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Oil Pressure (PSI)
              </label>
              <input
                type="number"
                value={engineData.oilPressure}
                onChange={(e) => updateEngineStatus('oilPressure', parseInt(e.target.value))}
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

export default EngineHealthPage;