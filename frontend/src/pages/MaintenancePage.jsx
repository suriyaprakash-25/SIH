import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Droplets, 
  Sparkles, 
  Car, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Calendar,
  User,
  Wrench,
  Search,
  Bell,
  XCircle,
  RefreshCw,
  Save,
  Trash2,
  Zap
} from 'lucide-react';

export default function MaintenancePage() {
  const { user, logout } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cleaningData, setCleaningData] = useState({});
  const [brandingData, setBrandingData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock branding data (simulating fetch from branding priorities page)
  useEffect(() => {
    const mockBrandingData = {
      'KMRL-TS-01': { endDate: '2024-01-15', status: 'expired' },
      'KMRL-TS-02': { endDate: '2024-02-20', status: 'active' },
      'KMRL-TS-03': { endDate: '2024-01-10', status: 'expired' },
      'KMRL-TS-04': { endDate: '2024-03-25', status: 'active' },
      'KMRL-TS-05': { endDate: '2024-01-08', status: 'expired' },
      'KMRL-TS-06': { endDate: '2024-04-30', status: 'active' },
      'KMRL-TS-07': { endDate: '2024-01-18', status: 'expired' },
      'KMRL-TS-08': { endDate: '2024-05-15', status: 'active' },
      'KMRL-TS-09': { endDate: '2024-01-12', status: 'expired' },
      'KMRL-TS-10': { endDate: '2024-06-20', status: 'active' },
      'KMRL-TS-11': { endDate: '2024-01-25', status: 'expired' },
      'KMRL-TS-12': { endDate: '2024-07-10', status: 'active' },
      'KMRL-TS-13': { endDate: '2024-01-05', status: 'expired' },
      'KMRL-TS-14': { endDate: '2024-08-15', status: 'active' },
      'KMRL-TS-15': { endDate: '2024-01-20', status: 'expired' },
      'KMRL-TS-16': { endDate: '2024-09-25', status: 'active' },
      'KMRL-TS-17': { endDate: '2024-01-30', status: 'expired' },
      'KMRL-TS-18': { endDate: '2024-10-05', status: 'active' },
      'KMRL-TS-19': { endDate: '2024-01-14', status: 'expired' },
      'KMRL-TS-20': { endDate: '2024-11-20', status: 'active' },
      'KMRL-TS-21': { endDate: '2024-01-28', status: 'expired' },
      'KMRL-TS-22': { endDate: '2024-12-15', status: 'active' },
      'KMRL-TS-23': { endDate: '2024-01-22', status: 'expired' },
      'KMRL-TS-24': { endDate: '2024-12-30', status: 'active' },
      'KMRL-TS-25': { endDate: '2024-01-16', status: 'expired' }
    };
    setBrandingData(mockBrandingData);

    // Initialize cleaning data for all trains
    const initialCleaningData = {};
    for (let i = 1; i <= 25; i++) {
      const trainId = `KMRL-TS-${i.toString().padStart(2, '0')}`;
      initialCleaningData[trainId] = {
        endOfTripCleaning: { 
          completed: Math.random() > 0.3, 
          lastDone: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          assignedTo: `Cleaner ${Math.floor(Math.random() * 5) + 1}` 
        },
        dailyContactPoints: { 
          completed: Math.random() > 0.4, 
          lastDone: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          assignedTo: `Contact Team ${Math.floor(Math.random() * 3) + 1}` 
        },
        automatedWash: { 
          completed: Math.random() > 0.2, 
          lastDone: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString().split('T')[0], 
          assignedTo: `Wash Operator ${Math.floor(Math.random() * 2) + 1}` 
        },
        covidDisinfection: { 
          completed: Math.random() > 0.6, 
          lastDone: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString().split('T')[0], 
          assignedTo: `Disinfection Specialist ${Math.floor(Math.random() * 3) + 1}` 
        },
        deepCleaning: { 
          completed: mockBrandingData[trainId]?.status === 'expired' ? Math.random() > 0.7 : true, 
          required: mockBrandingData[trainId]?.status === 'expired',
          lastDone: mockBrandingData[trainId]?.status === 'expired' ? null : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          assignedTo: mockBrandingData[trainId]?.status === 'expired' ? '' : `Deep Clean Team ${Math.floor(Math.random() * 2) + 1}` 
        },
        cleaningType: ['quick', 'intermediate', 'deep'][Math.floor(Math.random() * 3)],
        lastInspection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        inspector: `Inspector ${Math.floor(Math.random() * 5) + 1}`,
        overallScore: Math.floor(Math.random() * 30) + 70,
        currentPriority: mockBrandingData[trainId]?.status === 'expired' ? 'high' : ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      };
    }
    setCleaningData(initialCleaningData);
    setLoading(false);
  }, []);

  // Generate 25 trains
  const trains = Array.from({ length: 25 }, (_, i) => ({
    id: `KMRL-TS-${(i + 1).toString().padStart(2, '0')}`,
    status: Math.random() > 0.7 ? 'needs_attention' : Math.random() > 0.3 ? 'clean' : 'under_maintenance'
  }));

  const filteredTrains = trains.filter(train => 
    train.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'clean': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'under_maintenance': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'clean': return 'Clean';
      case 'needs_attention': return 'Needs Attention';
      case 'under_maintenance': return 'Under Maintenance';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const updateCleaningTask = (trainId, taskType, field, value) => {
    setCleaningData(prev => ({
      ...prev,
      [trainId]: {
        ...prev[trainId],
        [taskType]: {
          ...prev[trainId][taskType],
          [field]: value,
          ...(field === 'completed' && value && { lastDone: new Date().toISOString().split('T')[0] })
        }
      }
    }));
  };

  const updateCleaningType = (trainId, type) => {
    setCleaningData(prev => ({
      ...prev,
      [trainId]: {
        ...prev[trainId],
        cleaningType: type
      }
    }));
  };

  const sendNotification = (trainId, message, type = 'cleaning_alert') => {
    const notification = {
      id: Date.now(),
      trainId,
      message,
      timestamp: new Date().toLocaleString(),
      type
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
    alert(`Notification sent: ${message} for ${trainId}`);
  };

  const saveCleaningData = (trainId) => {
    // In a real app, this would save to backend
    const trainData = cleaningData[trainId];
    const completedTasks = Object.values(trainData).filter(task => 
      typeof task === 'object' && task.completed
    ).length;
    
    alert(`Cleaning data saved for ${trainId}\nCompleted tasks: ${completedTasks}/5\nOverall score: ${trainData.overallScore}/100`);
  };

  if (!user || (user.role !== 'Cleaning & Maintenance' && user.role !== 'Admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have permission to access this section.</p>
          <button 
            onClick={logout}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (selectedTrain) {
    const trainData = cleaningData[selectedTrain.id] || {};
    const brandingInfo = brandingData[selectedTrain.id] || {};
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedTrain(null)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Train List
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTrain.id} - Cleaning & Maintenance
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Inspection: {trainData.lastInspection} | Inspector: {trainData.inspector}
                </p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Cleaning Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Cleaning Type & Criteria Selection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'quick', duration: '30 minutes', description: 'End-of-trip + Daily contact points', frequency: 'After each trip' },
                  { type: 'intermediate', duration: '2-3 hours', description: 'Comprehensive cleaning + Sanitization', frequency: 'Every 3-4 days' },
                  { type: 'deep', duration: '4-6 hours', description: 'Full overhaul + Branding removal', frequency: 'When branding expires' }
                ].map(({ type, duration, description, frequency }) => (
                  <button
                    key={type}
                    onClick={() => updateCleaningType(selectedTrain.id, type)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      trainData.cleaningType === type
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold capitalize text-gray-900 dark:text-white">{type} Clean</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{duration}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">{frequency}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cleaning Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. End-of-trip cleaning + Sanitization */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  1. End-of-Trip Cleaning + Sanitization
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="endTrip"
                      checked={trainData.endOfTripCleaning?.completed || false}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'endOfTripCleaning', 'completed', e.target.checked)}
                      className="w-5 h-5 text-blue-500 rounded"
                    />
                    <label htmlFor="endTrip" className="flex-1 font-medium">
                      Quick clean and sanitization completed
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To:</label>
                    <input
                      type="text"
                      value={trainData.endOfTripCleaning?.assignedTo || ''}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'endOfTripCleaning', 'assignedTo', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter cleaner name"
                    />
                  </div>
                  {trainData.endOfTripCleaning?.lastDone && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ Last completed: {trainData.endOfTripCleaning.lastDone}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Daily cleaning of contact points */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  2. Daily Contact Points Cleaning
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="contactPoints"
                      checked={trainData.dailyContactPoints?.completed || false}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'dailyContactPoints', 'completed', e.target.checked)}
                      className="w-5 h-5 text-orange-500 rounded"
                    />
                    <label htmlFor="contactPoints" className="flex-1 font-medium">
                      Contact points cleaned and disinfected
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To:</label>
                    <input
                      type="text"
                      value={trainData.dailyContactPoints?.assignedTo || ''}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'dailyContactPoints', 'assignedTo', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter contact points specialist name"
                    />
                  </div>
                  {trainData.dailyContactPoints?.lastDone && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ Last completed: {trainData.dailyContactPoints.lastDone}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Automated wash plant at depot */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-teal-500" />
                  3. Automated Wash Plant at Depot
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="automatedWash"
                      checked={trainData.automatedWash?.completed || false}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'automatedWash', 'completed', e.target.checked)}
                      className="w-5 h-5 text-teal-500 rounded"
                    />
                    <label htmlFor="automatedWash" className="flex-1 font-medium">
                      Automated wash cycle completed
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To:</label>
                    <input
                      type="text"
                      value={trainData.automatedWash?.assignedTo || ''}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'automatedWash', 'assignedTo', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter wash plant operator name"
                    />
                  </div>
                  {trainData.automatedWash?.lastDone && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ Last completed: {trainData.automatedWash.lastDone}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. COVID disinfection protocol */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  4. COVID Disinfection Protocol
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="covidDisinfection"
                      checked={trainData.covidDisinfection?.completed || false}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'covidDisinfection', 'completed', e.target.checked)}
                      className="w-5 h-5 text-red-500 rounded"
                    />
                    <label htmlFor="covidDisinfection" className="flex-1 font-medium">
                      Enhanced COVID disinfection completed
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To:</label>
                    <input
                      type="text"
                      value={trainData.covidDisinfection?.assignedTo || ''}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'covidDisinfection', 'assignedTo', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter disinfection specialist name"
                    />
                  </div>
                  {trainData.covidDisinfection?.lastDone && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ Last completed: {trainData.covidDisinfection.lastDone}
                    </p>
                  )}
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> Activate only during COVID outbreaks or heightened hygiene protocols
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Deep cleaning section (when branding period is over) */}
            {brandingInfo.status === 'expired' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 border-l-4 border-l-red-500">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  5. Deep Cleaning Required - Branding Period Expired
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                  <p className="text-red-700 dark:text-red-300">
                    <strong>⚠️ Alert:</strong> Branding period expired on {brandingInfo.endDate}. 
                    Deep cleaning required to remove stickers, posters, and complete overhaul.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="deepCleaning"
                      checked={trainData.deepCleaning?.completed || false}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'deepCleaning', 'completed', e.target.checked)}
                      className="w-5 h-5 text-red-500 rounded"
                    />
                    <label htmlFor="deepCleaning" className="flex-1 font-medium">
                      Deep cleaning and branding removal completed
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To:</label>
                    <input
                      type="text"
                      value={trainData.deepCleaning?.assignedTo || ''}
                      onChange={(e) => updateCleaningTask(selectedTrain.id, 'deepCleaning', 'assignedTo', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter deep cleaning specialist team name"
                    />
                  </div>
                  {trainData.deepCleaning?.lastDone && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ Last completed: {trainData.deepCleaning.lastDone}
                    </p>
                  )}
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Deep Cleaning Tasks:</strong> Remove all stickers and posters, thorough interior cleaning, 
                      exterior wash, seat deep cleaning, floor scrubbing, window cleaning, and preparation for new branding.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Center */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" />
                Send Notifications to Cleaning Personnel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => sendNotification(selectedTrain.id, 'Urgent cleaning required - please prioritize immediately', 'urgent')}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Urgent Clean Alert
                </button>
                <button
                  onClick={() => sendNotification(selectedTrain.id, 'Scheduled maintenance cleaning reminder', 'maintenance')}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Maintenance Reminder
                </button>
                <button
                  onClick={() => sendNotification(selectedTrain.id, 'Deep cleaning required - branding period expired', 'deep_clean')}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-colors"
                  disabled={brandingInfo.status !== 'expired'}
                >
                  <Trash2 className="w-4 h-4" />
                  Deep Clean Required
                </button>
                <button
                  onClick={() => sendNotification(selectedTrain.id, 'COVID disinfection protocol activation', 'covid')}
                  className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  COVID Protocol
                </button>
              </div>
            </div>

            {/* Summary Dashboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cleaning Summary Dashboard</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trainData.overallScore >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  trainData.overallScore >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  Overall Score: {trainData.overallScore}/100
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                  { key: 'endOfTripCleaning', name: 'End-Trip', icon: Droplets },
                  { key: 'dailyContactPoints', name: 'Contact Points', icon: Wrench },
                  { key: 'automatedWash', name: 'Auto Wash', icon: Car },
                  { key: 'covidDisinfection', name: 'COVID Protocol', icon: Shield },
                  { key: 'deepCleaning', name: 'Deep Clean', icon: Sparkles }
                ].map(({ key, name, icon: Icon }) => (
                  <div key={key} className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      trainData[key]?.completed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 
                      'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {trainData[key]?.completed ? '✅ Done' : '⏳ Pending'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Current Priority</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getPriorityColor(trainData.currentPriority)}`}>
                    {trainData.currentPriority?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Cleaning Type</h4>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-2 capitalize">
                    {trainData.cleaningType || 'Quick'}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Last Inspector</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {trainData.inspector || 'Not assigned'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => saveCleaningData(selectedTrain.id)}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Cleaning Data & Generate Report
              </button>
            </div>

            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Bell className="w-4 h-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Train list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cleaning & Maintenance Operations</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Comprehensive cleaning management system for {trains.length} trains
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search and filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trains by ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Train grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTrains.map((train) => {
                const trainData = cleaningData[train.id] || {};
                const brandingInfo = brandingData[train.id] || {};
                const completedTasks = Object.values(trainData).filter(task => 
                  typeof task === 'object' && task.completed
                ).length;
                const totalTasks = brandingInfo.status === 'expired' ? 5 : 4;
                
                return (
                  <div
                    key={train.id}
                    onClick={() => setSelectedTrain(train)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{train.id}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(train.status)}`}>
                        {getStatusText(train.status)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Complete</span>
                        <span className="font-medium">{completedTasks}/{totalTasks}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
                        <span className={`font-medium ${
                          trainData.overallScore >= 90 ? 'text-green-600' :
                          trainData.overallScore >= 75 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {trainData.overallScore || 0}/100
                        </span>
                      </div>

                      {brandingInfo.status === 'expired' && (
                        <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-700 dark:text-red-300 font-medium">
                            Deep Clean Required
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Last cleaned: {trainData.lastInspection || 'N/A'}</span>
                        <Clock className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Cleaning Operations Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{trains.filter(t => getStatusText(t.status) === 'Clean').length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Clean Trains</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{trains.filter(t => getStatusText(t.status) === 'Needs Attention').length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Needs Attention</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{Object.values(brandingData).filter(b => b.status === 'expired').length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Deep Clean Required</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{trains.filter(t => getStatusText(t.status) === 'Under Maintenance').length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Under Maintenance</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}