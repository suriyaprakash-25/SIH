import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Save,
  Shield,
  Award,
  Calendar,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Plus,
  Train as TrainIcon,
  ArrowLeft,
  Wrench,
  Zap,
  Car
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CertificationPage = () => {
  const { user } = useAuth();
  
  // State management
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [fitnessData, setFitnessData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load train data
  useEffect(() => {
    loadTrainData();
  }, []);

  const loadTrainData = async () => {
    try {
      setLoading(true);
      
      // Generate 25 trains with fitness certificate data
      const trainData = generateTrainData();
      setTrains(trainData);
      
      // Initialize fitness data for all trains
      const initialFitnessData = {};
      trainData.forEach(train => {
        initialFitnessData[train.trainId] = {
          brakes: { status: 'complete', repairDays: 0 },
          engine: { status: 'complete', repairDays: 0 },
          bogies: { status: 'complete', repairDays: 0 }
        };
      });
      setFitnessData(initialFitnessData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading train data:', error);
      setLoading(false);
    }
  };

  const generateTrainData = () => {
    const trains = [];
    const statuses = ['Valid', 'Expired', 'Expiring Soon'];
    
    for (let trainNum = 1; trainNum <= 25; trainNum++) {
      const trainId = `KMRL-TS-${trainNum.toString().padStart(2, '0')}`;
      const status = statuses[trainNum % 3];
      
      trains.push({
        trainId,
        status,
        lastInspection: `2024-${Math.floor(Math.random() * 3 + 7).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
        nextInspection: `2024-${Math.floor(Math.random() * 3 + 10).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
        inspector: `Inspector ${String.fromCharCode(65 + (trainNum % 5))}`,
        score: Math.floor(Math.random() * 20 + 80)
      });
    }
    
    return trains;
  };

  // Filter and search functionality
  const filteredTrains = trains.filter(train => {
    const matchesSearch = searchTerm === '' || 
      train.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Statistics
  const stats = {
    total: trains.length,
    valid: trains.filter(t => t.status === 'Valid').length,
    expiring: trains.filter(t => t.status === 'Expiring Soon').length,
    expired: trains.filter(t => t.status === 'Expired').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Valid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Expiring Soon':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSelectTrain = (train) => {
    setSelectedTrain(train);
  };

  const handleBackToList = () => {
    setSelectedTrain(null);
  };

  const handleFitnessChange = (trainId, component, field, value) => {
    setFitnessData(prev => ({
      ...prev,
      [trainId]: {
        ...prev[trainId],
        [component]: {
          ...prev[trainId][component],
          [field]: value
        }
      }
    }));
  };

  const handleRefresh = () => {
    loadTrainData();
    setLastUpdate(new Date());
  };

  const saveFitnessData = () => {
    // In a real application, this would save to the backend
    setLastUpdate(new Date());
    alert('Fitness certificate data saved successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authorized (fitness certificate role)
  if (user?.role !== 'Fitness Certificates' && user?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Shield className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          You need to be logged in with Fitness Certificates role to access this section.
        </p>
      </div>
    );
  }

  // Render detailed train view
  if (selectedTrain) {
    const trainFitness = fitnessData[selectedTrain.trainId] || {
      brakes: { status: 'complete', repairDays: 0 },
      engine: { status: 'complete', repairDays: 0 },
      bogies: { status: 'complete', repairDays: 0 }
    };

    const FitnessSection = ({ title, component, icon: Icon, data }) => (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Icon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.status === 'complete'}
                onChange={(e) => handleFitnessChange(
                  selectedTrain.trainId, 
                  component, 
                  'status', 
                  e.target.checked ? 'complete' : 'incomplete'
                )}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Complete</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.status === 'incomplete'}
                onChange={(e) => handleFitnessChange(
                  selectedTrain.trainId, 
                  component, 
                  'status', 
                  e.target.checked ? 'incomplete' : 'complete'
                )}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Incomplete</span>
            </label>
          </div>

          {data.status === 'incomplete' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated repair days:
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={data.repairDays}
                onChange={(e) => handleFitnessChange(
                  selectedTrain.trainId, 
                  component, 
                  'repairDays', 
                  parseInt(e.target.value) || 0
                )}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Days"
              />
            </div>
          )}

          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            data.status === 'complete' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            Status: {data.status === 'complete' ? 'Complete' : `Incomplete (${data.repairDays} days to repair)`}
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Train List</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <TrainIcon className="w-8 h-8 text-blue-600" />
                <span>Fitness Certificate - {selectedTrain.trainId}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Train Fitness Inspection & Certification
              </p>
            </div>
          </div>
          <button
            onClick={saveFitnessData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Train Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Train ID</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTrain.trainId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Status</p>
              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedTrain.status)}`}>
                {getStatusIcon(selectedTrain.status)}
                <span>{selectedTrain.status}</span>
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Inspection</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(selectedTrain.lastInspection).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inspector</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedTrain.inspector}</p>
            </div>
          </div>
        </div>

        {/* Fitness Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FitnessSection
            title="Brake System"
            component="brakes"
            icon={Wrench}
            data={trainFitness.brakes}
          />
          
          <FitnessSection
            title="Engine System"
            component="engine"
            icon={Zap}
            data={trainFitness.engine}
          />
          
          <FitnessSection
            title="Bogies (Movement)"
            component="bogies"
            icon={Car}
            data={trainFitness.bogies}
          />
        </div>

        {/* Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Fitness Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(trainFitness).map(([component, data]) => (
              <div key={component} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white capitalize">{component}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  data.status === 'complete' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {data.status === 'complete' ? 'Complete' : `${data.repairDays} days`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render train list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Fitness Certificate Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            KMRL Fleet Fitness Certification System - 25 Trains
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              <User className="w-4 h-4" />
              <span>Certification Officer: {user?.username}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trains</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
            <TrainIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valid</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.valid}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.expiring}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expired}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by train ID or inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Trains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrains.map((train) => (
          <div
            key={train.trainId}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleSelectTrain(train)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <TrainIcon className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">{train.trainId}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(train.status)}`}>
                {train.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Inspection:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(train.lastInspection).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Inspector:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{train.inspector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                <span className={`text-sm font-bold ${train.score >= 90 ? 'text-green-600' : train.score >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {train.score}/100
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                View Fitness Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTrains.length === 0 && (
        <div className="text-center py-12">
          <TrainIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trains found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              KMRL Safety Compliance System
            </span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
          <strong>Fleet Overview:</strong> 25 Metro Trains • 
          {stats.valid} Valid • {stats.expiring} Expiring Soon • {stats.expired} Expired
        </div>
      </div>
    </div>
  );
};

export default CertificationPage;