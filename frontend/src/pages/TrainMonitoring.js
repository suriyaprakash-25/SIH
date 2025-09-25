import React, { useState, useEffect } from 'react';
import { 
  Engine, 
  Droplets, 
  FileCheck, 
  Palette, 
  Wrench, 
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Save,
  Edit3
} from 'lucide-react';

const TrainMonitoring = () => {
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [activeSection, setActiveSection] = useState('engine');
  const [trainData, setTrainData] = useState({});
  const [editMode, setEditMode] = useState(false);

  // 6 Critical Monitoring Sections
  const monitoringSections = [
    {
      id: 'engine',
      name: 'Engine Health',
      icon: Engine,
      color: 'red',
      description: 'Motor, brakes, electrical systems'
    },
    {
      id: 'cleaning',
      name: 'Compartment Cleanliness',
      icon: Droplets,
      color: 'blue',
      description: 'Passenger areas, floors, seats'
    },
    {
      id: 'certificates',
      name: 'Fitness Certificates',
      icon: FileCheck,
      color: 'green',
      description: 'Safety & regulatory compliance'
    },
    {
      id: 'branding',
      name: 'Branding Status',
      icon: Palette,
      color: 'purple',
      description: 'Advertisements, exterior wraps'
    },
    {
      id: 'maintenance',
      name: 'Job Cards',
      icon: Wrench,
      color: 'orange',
      description: 'Scheduled & emergency repairs'
    },
    {
      id: 'mileage',
      name: 'Service Intervals',
      icon: Gauge,
      color: 'indigo',
      description: 'Mileage-based maintenance'
    }
  ];

  const trains = [
    'KMRL-TS-01', 'KMRL-TS-02', 'KMRL-TS-03', 
    'KMRL-TS-04', 'KMRL-TS-05'
  ];

  useEffect(() => {
    loadTrainData();
  }, [selectedTrain]);

  const loadTrainData = async () => {
    // Simulate loading train data from backend
    const mockData = {
      'KMRL-TS-01': {
        engine: {
          status: 'healthy',
          lastCheck: '2024-09-20',
          issues: [],
          motorEfficiency: 98,
          brakeStatus: 'good',
          electricalSystems: 'operational'
        },
        cleaning: {
          status: 'clean',
          lastCleaned: '2024-09-24',
          cleaningType: 'deep-clean',
          compartmentStatus: {
            passengerArea: 'clean',
            floors: 'clean',
            seats: 'clean',
            windows: 'clean'
          }
        },
        certificates: {
          status: 'valid',
          fitnessExpiry: '2024-12-15',
          telecomCert: 'active',
          signallingCert: 'active',
          expiryDays: 45
        },
        branding: {
          status: 'active',
          advertiser: 'V-Guard',
          slaCompliance: 95,
          exteriorCondition: 'good'
        },
        maintenance: {
          openJobCards: 0,
          lastMaintenance: '2024-09-15',
          nextScheduled: '2024-10-15',
          priority: 'low'
        },
        mileage: {
          total: 75000,
          serviceInterval: 5000,
          nextService: 80000,
          daysToService: 15
        }
      }
      // Add other trains...
    };

    setTrainData(mockData[selectedTrain] || {});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'clean':
      case 'valid':
      case 'active':
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'needs-attention':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'dirty':
      case 'expired':
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'clean':
      case 'valid':
      case 'active':
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'needs-attention':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
      case 'dirty':
      case 'expired':
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const updateFactorStatus = async (factor, updates) => {
    // Update the specific factor and trigger job card creation if needed
    const newData = {
      ...trainData,
      [factor]: { ...trainData[factor], ...updates }
    };
    
    setTrainData(newData);
    
    // Auto-generate job cards based on status changes
    if (updates.status === 'critical' || updates.status === 'dirty' || updates.status === 'expired') {
      await createJobCard(factor, updates);
    }
  };

  const createJobCard = async (factor, issue) => {
    const jobCard = {
      trainId: selectedTrain,
      factor: factor,
      status: 'Open',
      priority: issue.status === 'critical' ? 'High' : 'Medium',
      description: `${factor} requires attention: ${issue.reason || 'Status changed'}`,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24*60*60*1000).toISOString() // 24 hours
    };
    
    console.log('Auto-generated job card:', jobCard);
    // Here you would call the backend API to create the job card
  };

  const renderEngineSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Motor Efficiency</h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">{trainData.engine?.motorEfficiency || 0}%</span>
            {editMode && (
              <input 
                type="number" 
                className="ml-2 w-16 px-2 py-1 border rounded"
                defaultValue={trainData.engine?.motorEfficiency}
              />
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Brake System</h4>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(trainData.engine?.brakeStatus)}`}>
            {getStatusIcon(trainData.engine?.brakeStatus)}
            <span className="ml-1 capitalize">{trainData.engine?.brakeStatus || 'Unknown'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Electrical Systems</h4>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(trainData.engine?.electricalSystems)}`}>
            {getStatusIcon(trainData.engine?.electricalSystems)}
            <span className="ml-1 capitalize">{trainData.engine?.electricalSystems || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Update Engine Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <select className="px-3 py-2 border rounded-lg">
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            <button 
              onClick={() => updateFactorStatus('engine', { status: 'healthy', lastCheck: new Date().toISOString() })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCleaningSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['passengerArea', 'floors', 'seats', 'windows'].map((area) => (
          <div key={area} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
              {area.replace(/([A-Z])/g, ' $1')}
            </h4>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(trainData.cleaning?.compartmentStatus?.[area])}`}>
              {getStatusIcon(trainData.cleaning?.compartmentStatus?.[area])}
              <span className="ml-1 capitalize">{trainData.cleaning?.compartmentStatus?.[area] || 'Unknown'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Cleaning Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Last Cleaned:</span>
            <span className="ml-2 font-medium">{trainData.cleaning?.lastCleaned || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Type:</span>
            <span className="ml-2 font-medium capitalize">{trainData.cleaning?.cleaningType || 'N/A'}</span>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Update Cleaning Status</h4>
          <div className="space-y-3">
            <select className="w-full px-3 py-2 border rounded-lg">
              <option value="clean">Clean</option>
              <option value="needs-cleaning">Needs Cleaning</option>
              <option value="dirty">Dirty</option>
            </select>
            <button 
              onClick={() => updateFactorStatus('cleaning', { status: 'clean', lastCleaned: new Date().toISOString() })}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Mark as Cleaned
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCertificatesSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fitness Certificate</h4>
          <div className="space-y-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(trainData.certificates?.status)}`}>
              {getStatusIcon(trainData.certificates?.status)}
              <span className="ml-1 capitalize">{trainData.certificates?.status || 'Unknown'}</span>
            </div>
            <div className="text-sm text-gray-600">
              Expires: {trainData.certificates?.fitnessExpiry || 'N/A'} 
              ({trainData.certificates?.expiryDays || 0} days)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">System Certificates</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm">Telecom:</span>
              <span className={`text-sm ${trainData.certificates?.telecomCert === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {trainData.certificates?.telecomCert || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Signalling:</span>
              <span className={`text-sm ${trainData.certificates?.signallingCert === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {trainData.certificates?.signallingCert || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Open Job Cards</h4>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${trainData.maintenance?.openJobCards > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trainData.maintenance?.openJobCards || 0}
            </span>
            <span className="text-sm text-gray-600">active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Last Maintenance</h4>
          <div className="text-sm text-gray-600">
            {trainData.maintenance?.lastMaintenance || 'N/A'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Scheduled</h4>
          <div className="text-sm text-gray-600">
            {trainData.maintenance?.nextScheduled || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'engine':
        return renderEngineSection();
      case 'cleaning':
        return renderCleaningSection();
      case 'certificates':
        return renderCertificatesSection();
      case 'maintenance':
        return renderMaintenanceSection();
      case 'branding':
        return (
          <div className="text-center py-8 text-gray-500">
            Branding section content coming soon...
          </div>
        );
      case 'mileage':
        return (
          <div className="text-center py-8 text-gray-500">
            Mileage section content coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Train Availability Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor 6 critical factors that determine train service availability
          </p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedTrain} 
            onChange={(e) => setSelectedTrain(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {trains.map(train => (
              <option key={train} value={train}>{train}</option>
            ))}
          </select>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              editMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {editMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{editMode ? 'Save Changes' : 'Edit Mode'}</span>
          </button>
        </div>
      </div>

      {/* 6 Factor Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {monitoringSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 px-6 py-4 flex items-center space-x-3 border-b-2 transition-colors duration-200 ${
                  isActive
                    ? `border-${section.color}-500 bg-${section.color}-50 dark:bg-${section.color}-900/20`
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? `text-${section.color}-600` : 'text-gray-500'}`} />
                <div className="text-left">
                  <div className={`font-medium ${isActive ? `text-${section.color}-700 dark:text-${section.color}-300` : 'text-gray-700 dark:text-gray-300'}`}>
                    {section.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {section.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {monitoringSections.find(s => s.id === activeSection)?.name} - {selectedTrain}
          </h2>
          <button
            onClick={loadTrainData}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {renderCurrentSection()}
      </div>

      {/* Availability Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Overall Availability Status - {selectedTrain}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {monitoringSections.map((section) => {
            const Icon = section.icon;
            const status = trainData[section.id]?.status || 'unknown';
            
            return (
              <div key={section.id} className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getStatusColor(status)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{section.name}</div>
                <div className={`text-xs capitalize ${getStatusColor(status).split(' ')[0]}`}>
                  {status}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-white">Train Service Availability:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              Object.values(trainData).every(factor => factor?.status === 'healthy' || factor?.status === 'clean' || factor?.status === 'valid' || factor?.status === 'active' || factor?.status === 'good')
                ? 'bg-green-100 text-green-800'
                : Object.values(trainData).some(factor => factor?.status === 'critical' || factor?.status === 'expired' || factor?.status === 'dirty')
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {Object.values(trainData).every(factor => factor?.status === 'healthy' || factor?.status === 'clean' || factor?.status === 'valid' || factor?.status === 'active' || factor?.status === 'good')
                ? 'AVAILABLE FOR SERVICE'
                : Object.values(trainData).some(factor => factor?.status === 'critical' || factor?.status === 'expired' || factor?.status === 'dirty')
                ? 'NOT AVAILABLE - CRITICAL ISSUES'
                : 'LIMITED AVAILABILITY - CHECK REQUIRED'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainMonitoring;