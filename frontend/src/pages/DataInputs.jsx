import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  FileText,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';

const DataInputs = () => {
  const [activeTab, setActiveTab] = useState('fitness');
  const [fitnessData, setFitnessData] = useState([]);
  const [jobCardData, setJobCardData] = useState([]);
  const [brandingData, setBrandingData] = useState([]);
  const [mileageData, setMileageData] = useState([]);
  const [cleaningData, setCleaningData] = useState([]);
  const [geometryData, setGeometryData] = useState([]);
  
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});

  const tabs = [
    { id: 'fitness', label: 'Fitness Certificates', icon: FileText },
    { id: 'jobcard', label: 'Job Cards', icon: Activity },
    { id: 'branding', label: 'Branding', icon: Edit3 },
    { id: 'mileage', label: 'Mileage', icon: Calendar },
    { id: 'cleaning', label: 'Cleaning', icon: CheckCircle },
    { id: 'geometry', label: 'Geometry/Stabling', icon: MapPin }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Load mock data - in real app, this would come from API
    setFitnessData([
      { trainId: 'K-101', status: 'Valid', expiryDate: '2024-12-15', issueDate: '2024-06-15', certType: 'Electrical' },
      { trainId: 'K-102', status: 'Valid', expiryDate: '2024-11-20', issueDate: '2024-05-20', certType: 'Mechanical' },
      { trainId: 'K-103', status: 'Expired', expiryDate: '2024-09-01', issueDate: '2024-03-01', certType: 'Telecom' },
    ]);

    setJobCardData([
      { trainId: 'K-101', jobId: 'JC-2024-001', status: 'Closed', priority: 'Low', description: 'Routine maintenance', dueDate: '2024-09-15' },
      { trainId: 'K-105', jobId: 'JC-2024-002', status: 'Open', priority: 'High', description: 'Brake system check', dueDate: '2024-09-12' },
    ]);

    setBrandingData([
      { trainId: 'K-101', category: 'Premium', exposureHours: 120, lastBrandingDate: '2024-08-01', brandingType: 'External Wrap' },
      { trainId: 'K-102', category: 'Standard', exposureHours: 85, lastBrandingDate: '2024-07-15', brandingType: 'Interior Ads' },
    ]);

    setMileageData([
      { trainId: 'K-101', totalMileage: 45200, dailyAvg: 245, lastServiceMileage: 44800, nextServiceDue: 46000 },
      { trainId: 'K-102', totalMileage: 38900, dailyAvg: 230, lastServiceMileage: 38500, nextServiceDue: 39500 },
    ]);

    setCleaningData([
      { trainId: 'K-101', slotTime: '06:00', duration: 45, status: 'Completed', lastCleaned: '2024-09-09', nextDue: '2024-09-12' },
      { trainId: 'K-102', slotTime: '07:30', duration: 45, status: 'Scheduled', lastCleaned: '2024-09-08', nextDue: '2024-09-11' },
    ]);

    setGeometryData([
      { trainId: 'K-101', bayPosition: 'A1', stablingTime: '22:00', departureTime: '05:30', trackNumber: 1, status: 'Occupied' },
      { trainId: 'K-102', bayPosition: 'A2', stablingTime: '22:30', departureTime: '06:00', trackNumber: 2, status: 'Available' },
    ]);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'fitness': return fitnessData;
      case 'jobcard': return jobCardData;
      case 'branding': return brandingData;
      case 'mileage': return mileageData;
      case 'cleaning': return cleaningData;
      case 'geometry': return geometryData;
      default: return [];
    }
  };

  const setCurrentData = (data) => {
    switch (activeTab) {
      case 'fitness': setFitnessData(data); break;
      case 'jobcard': setJobCardData(data); break;
      case 'branding': setBrandingData(data); break;
      case 'mileage': setMileageData(data); break;
      case 'cleaning': setCleaningData(data); break;
      case 'geometry': setGeometryData(data); break;
    }
  };

  const handleAdd = () => {
    const newItemTemplate = getNewItemTemplate();
    setNewItem(newItemTemplate);
    setEditingItem('new');
  };

  const handleEdit = (item, index) => {
    setNewItem({...item});
    setEditingItem(index);
  };

  const handleSave = () => {
    const currentData = getCurrentData();
    if (editingItem === 'new') {
      setCurrentData([...currentData, newItem]);
    } else {
      const updatedData = [...currentData];
      updatedData[editingItem] = newItem;
      setCurrentData(updatedData);
    }
    setEditingItem(null);
    setNewItem({});
  };

  const handleDelete = (index) => {
    const currentData = getCurrentData();
    const updatedData = currentData.filter((_, i) => i !== index);
    setCurrentData(updatedData);
  };

  const getNewItemTemplate = () => {
    switch (activeTab) {
      case 'fitness':
        return { trainId: '', status: 'Valid', expiryDate: '', issueDate: '', certType: 'Electrical' };
      case 'jobcard':
        return { trainId: '', jobId: '', status: 'Open', priority: 'Medium', description: '', dueDate: '' };
      case 'branding':
        return { trainId: '', category: 'Standard', exposureHours: 0, lastBrandingDate: '', brandingType: '' };
      case 'mileage':
        return { trainId: '', totalMileage: 0, dailyAvg: 0, lastServiceMileage: 0, nextServiceDue: 0 };
      case 'cleaning':
        return { trainId: '', slotTime: '', duration: 45, status: 'Scheduled', lastCleaned: '', nextDue: '' };
      case 'geometry':
        return { trainId: '', bayPosition: '', stablingTime: '', departureTime: '', trackNumber: 1, status: 'Available' };
      default:
        return {};
    }
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'fitness':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Train ID</label>
                <input
                  type="text"
                  value={newItem.trainId || ''}
                  onChange={(e) => setNewItem({...newItem, trainId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., K-101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={newItem.status || 'Valid'}
                  onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Valid">Valid</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certificate Type</label>
                <select
                  value={newItem.certType || 'Electrical'}
                  onChange={(e) => setNewItem({...newItem, certType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Telecom">Telecom</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Date</label>
                <input
                  type="date"
                  value={newItem.issueDate || ''}
                  onChange={(e) => setNewItem({...newItem, issueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={newItem.expiryDate || ''}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </>
        );
      
      case 'jobcard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Train ID</label>
                <input
                  type="text"
                  value={newItem.trainId || ''}
                  onChange={(e) => setNewItem({...newItem, trainId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., K-101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job ID</label>
                <input
                  type="text"
                  value={newItem.jobId || ''}
                  onChange={(e) => setNewItem({...newItem, jobId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., JC-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={newItem.status || 'Open'}
                  onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                <select
                  value={newItem.priority || 'Medium'}
                  onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Job description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newItem.dueDate || ''}
                  onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </>
        );

      // Add similar form fields for other tabs
      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Form fields for {activeTab} are being developed...
          </div>
        );
    }
  };

  const renderDataTable = () => {
    const currentData = getCurrentData();
    
    if (currentData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No data available. Click "Add New" to get started.
        </div>
      );
    }

    const getTableHeaders = () => {
      switch (activeTab) {
        case 'fitness':
          return ['Train ID', 'Status', 'Certificate Type', 'Issue Date', 'Expiry Date', 'Actions'];
        case 'jobcard':
          return ['Train ID', 'Job ID', 'Status', 'Priority', 'Description', 'Due Date', 'Actions'];
        default:
          return ['Train ID', 'Status', 'Actions'];
      }
    };

    const getTableRow = (item, index) => {
      switch (activeTab) {
        case 'fitness':
          return (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {item.trainId}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Valid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.certType}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.issueDate}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.expiryDate}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(item, index)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          );
        case 'jobcard':
          return (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {item.trainId}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.jobId}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Closed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.priority === 'High' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : item.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {item.priority}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                {item.description}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.dueDate}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(item, index)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          );
        default:
          return (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {item.trainId}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.status || 'N/A'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(item, index)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          );
      }
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {getTableHeaders().map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {currentData.map((item, index) => getTableRow(item, index))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Inputs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage train data for induction planning
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditingItem(null);
                    setNewItem({});
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-metro-blue text-metro-blue'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Add/Edit Form */}
          {editingItem !== null && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingItem === 'new' ? 'Add New Record' : 'Edit Record'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-metro-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setNewItem({});
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {renderFormFields()}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tabs.find(tab => tab.id === activeTab)?.label} Data
            </h2>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-metro-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          </div>

          {/* Data Table */}
          {renderDataTable()}
        </div>
      </div>
    </div>
  );
};

export default DataInputs;
