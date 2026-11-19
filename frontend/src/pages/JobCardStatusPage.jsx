import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Settings,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Battery,
  Droplets,
  FileText,
  Award,
  Gauge,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { jobCardService } from '../services/api';

const JobCardStatusPage = () => {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [jobCards, setJobCards] = useState([]);
  const [trainFactors, setTrainFactors] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [newJobCard, setNewJobCard] = useState({
    trainId: '',
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: '',
    dueDate: '',
    factor: 'maintenance'
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 6 Critical Factors for train availability
  const factors = [
    { key: 'engine', name: 'Engine Health', icon: Battery, color: 'blue' },
    { key: 'cleaning', name: 'Cleanliness', icon: Droplets, color: 'green' },
    { key: 'certificates', name: 'Fitness Certificates', icon: FileText, color: 'purple' },
    { key: 'branding', name: 'Branding Status', icon: Award, color: 'pink' },
    { key: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'orange' },
    { key: 'serviceInterval', name: 'Service Intervals', icon: Gauge, color: 'indigo' }
  ];

  useEffect(() => {
    loadJobCardData();
    loadTrainFactors();
  }, [selectedTrain]);

  const loadJobCardData = async () => {
    setLoading(true);
    try {
      const jobCardData = await jobCardService.getJobCards(selectedTrain);
      setJobCards(Array.isArray(jobCardData) ? jobCardData : []);
    } catch (error) {
      console.error('Error loading job cards:', error);
      setJobCards([]);
    }
    setLoading(false);
  };

  const loadTrainFactors = async () => {
    try {
      const factorData = await jobCardService.getTrainFactors(selectedTrain);
      setTrainFactors(factorData);
    } catch (error) {
      console.error('Error loading train factors:', error);
      setTrainFactors(jobCardService.generateDefaultFactors());
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // Save job cards and train factors using the service
      await jobCardService.updateTrainFactors(selectedTrain, trainFactors);
      
      // Save each job card that has been modified
      for (const jobCard of jobCards) {
        if (jobCard.modified || !jobCard.id.startsWith('JC-2024')) {
          await jobCardService.updateJobCard(jobCard.id, jobCard);
        }
      }
      
      setHasUnsavedChanges(false);
      setEditMode(false);
      
      // Show success message
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
    setLoading(false);
  };

  const handleCreateJobCard = async () => {
    try {
      const jobCardData = {
        trainId: newJobCard.trainId || selectedTrain,
        title: newJobCard.title,
        description: newJobCard.description,
        priority: newJobCard.priority,
        factor: newJobCard.factor,
        assignedTo: newJobCard.assignedTo,
        dueDate: newJobCard.dueDate,
        estimatedHours: 4,
        cost: 0
      };

      const createdJobCard = await jobCardService.createJobCard(jobCardData);
      
      setJobCards(prev => [...prev, createdJobCard]);
      setHasUnsavedChanges(true);
      setShowCreateModal(false);
      setNewJobCard({
        trainId: '',
        title: '',
        description: '',
        priority: 'Medium',
        assignedTo: '',
        dueDate: '',
        factor: 'maintenance'
      });

      // Auto-update factor status based on new job card
      if (trainFactors[newJobCard.factor]) {
        const updatedFactors = { ...trainFactors };
        updatedFactors[newJobCard.factor].openJobCards += 1;
        if (updatedFactors[newJobCard.factor].status === 'good' && newJobCard.priority === 'High') {
          updatedFactors[newJobCard.factor].status = 'warning';
        }
        setTrainFactors(updatedFactors);
      }
      
    } catch (error) {
      console.error('Error creating job card:', error);
      alert('Error creating job card. Please try again.');
    }
  };

  const handleUpdateJobCardStatus = async (jobCardId, newStatus) => {
    try {
      const updatedJobCards = jobCards.map(jc => {
        if (jc.id === jobCardId) {
          const updated = { ...jc, status: newStatus, modified: true };
          if (newStatus === 'Completed' && !jc.completedAt) {
            updated.completedAt = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return jc;
      });
      
      setJobCards(updatedJobCards);
      setHasUnsavedChanges(true);

      // Update factor status based on job card completion
      const jobCard = jobCards.find(jc => jc.id === jobCardId);
      if (jobCard && trainFactors[jobCard.factor]) {
        const updatedFactors = { ...trainFactors };
        if (newStatus === 'Completed') {
          updatedFactors[jobCard.factor].openJobCards = Math.max(0, updatedFactors[jobCard.factor].openJobCards - 1);
          if (updatedFactors[jobCard.factor].openJobCards === 0) {
            updatedFactors[jobCard.factor].status = 'good';
            updatedFactors[jobCard.factor].score = Math.min(95, updatedFactors[jobCard.factor].score + 10);
          }
        }
        setTrainFactors(updatedFactors);
      }
    } catch (error) {
      console.error('Error updating job card status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Open': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFactorIcon = (factor) => {
    const factorConfig = factors.find(f => f.key === factor);
    return factorConfig ? factorConfig.icon : Wrench;
  };

  const filteredJobCards = jobCards.filter(jc => {
    const statusMatch = filterStatus === 'all' || jc.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || jc.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const trainList = Array.from({length: 25}, (_, i) => `KMRL-TS-${String(i + 1).padStart(2, '0')}`);

  const overallAvailabilityScore = Object.values(trainFactors).reduce((acc, factor) => acc + factor.score, 0) / Object.keys(trainFactors).length || 0;
  const criticalFactorsCount = Object.values(trainFactors).filter(f => f.status === 'critical').length;
  const totalOpenJobCards = jobCards.filter(jc => jc.status === 'Open' || jc.status === 'In Progress').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Card Status & 6-Factor Monitoring</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.username} | Maintenance Job Tracking System</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Unsaved Changes</span>
                </div>
              )}
              <button
                onClick={() => loadJobCardData()}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Train Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Select Train</h2>
          <div className="flex flex-wrap gap-2">
            {trainList.slice(0, 10).map(train => (
              <button
                key={train}
                onClick={() => setSelectedTrain(train)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTrain === train 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {train}
              </button>
            ))}
            <select
              value={selectedTrain}
              onChange={(e) => setSelectedTrain(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {trainList.map(train => (
                <option key={train} value={train}>{train}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 6-Factor Status Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6-Factor Availability Analysis</h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Availability Score</p>
                <p className={`text-2xl font-bold ${overallAvailabilityScore >= 85 ? 'text-green-600' : overallAvailabilityScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {Math.round(overallAvailabilityScore)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical Factors</p>
                <p className={`text-2xl font-bold ${criticalFactorsCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {criticalFactorsCount}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {factors.map(factor => {
              const factorData = trainFactors[factor.key] || { status: 'unknown', score: 0, openJobCards: 0 };
              const IconComponent = factor.icon;
              
              return (
                <div key={factor.key} className={`p-4 rounded-xl border-2 transition-all ${getStatusColor(factorData.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className={`w-6 h-6 text-${factor.color}-600`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(factorData.status)}`}>
                      {factorData.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{factor.name}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Score:</span>
                      <span className="font-bold">{factorData.score}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Open Jobs:</span>
                      <span className={`font-bold ${factorData.openJobCards > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {factorData.openJobCards}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Cards Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Job Cards Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Total: {jobCards.length} | Open: {totalOpenJobCards}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Job Card</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Factor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredJobCards.map(jobCard => {
                  const FactorIcon = getFactorIcon(jobCard.factor);
                  return (
                    <tr key={jobCard.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {jobCard.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{jobCard.title}</div>
                          <div className="text-gray-500 text-xs">{jobCard.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <FactorIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-white capitalize">{jobCard.factor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={jobCard.status}
                          onChange={(e) => handleUpdateJobCardStatus(jobCard.id, e.target.value)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(jobCard.status)}`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(jobCard.priority)}`}>
                          {jobCard.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {jobCard.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{jobCard.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Job Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Job Card</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newJobCard.title}
                  onChange={(e) => setNewJobCard(prev => ({...prev, title: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter job card title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Factor</label>
                <select
                  value={newJobCard.factor}
                  onChange={(e) => setNewJobCard(prev => ({...prev, factor: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {factors.map(factor => (
                    <option key={factor.key} value={factor.key}>{factor.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={newJobCard.description}
                  onChange={(e) => setNewJobCard(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter detailed description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                <select
                  value={newJobCard.priority}
                  onChange={(e) => setNewJobCard(prev => ({...prev, priority: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newJobCard.dueDate}
                  onChange={(e) => setNewJobCard(prev => ({...prev, dueDate: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned To</label>
                <input
                  type="text"
                  value={newJobCard.assignedTo}
                  onChange={(e) => setNewJobCard(prev => ({...prev, assignedTo: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter team or person name"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJobCard}
                disabled={!newJobCard.title || !newJobCard.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Job Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCardStatusPage;