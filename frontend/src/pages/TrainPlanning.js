import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Filter, 
  Download, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { trainService } from '../services/api';

const TrainPlanning = () => {
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [inductionPlan, setInductionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fitnessStatus: 'all',
    jobCardStatus: 'all',
    brandingCategory: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    loadTrainData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trains, filters]);

  const loadTrainData = async () => {
    try {
      const data = await trainService.getTrains();
      setTrains(data);
    } catch (error) {
      console.error('Error loading train data:', error);
    }
  };

  const applyFilters = () => {
    let filtered = trains.filter(train => {
      const matchesFitness = filters.fitnessStatus === 'all' || 
        (filters.fitnessStatus === 'valid' && train.fitnessStatus === 'Valid') ||
        (filters.fitnessStatus === 'expired' && train.fitnessStatus === 'Expired');
      
      const matchesJobCard = filters.jobCardStatus === 'all' || 
        (filters.jobCardStatus === 'closed' && train.jobCardStatus === 'Closed') ||
        (filters.jobCardStatus === 'open' && train.jobCardStatus === 'Open');
      
      const matchesBranding = filters.brandingCategory === 'all' || 
        train.brandingCategory === filters.brandingCategory;
      
      const matchesSearch = filters.searchTerm === '' || 
        train.trainId.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesFitness && matchesJobCard && matchesBranding && matchesSearch;
    });
    
    setFilteredTrains(filtered);
  };

  const generateInductionPlan = async () => {
    setLoading(true);
    try {
      const plan = await trainService.generateInductionPlan(trains);
      setInductionPlan(plan);
    } catch (error) {
      console.error('Error generating induction plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportPlan = (format) => {
    if (!inductionPlan) return;
    
    if (format === 'csv') {
      trainService.exportPlanAsCSV(inductionPlan);
    } else if (format === 'pdf') {
      trainService.exportPlanAsPDF(inductionPlan);
    }
  };

  const getStatusIcon = (status, type) => {
    if (type === 'fitness') {
      return status === 'Valid' ? 
        <CheckCircle className="h-4 w-4 text-green-500" /> : 
        <XCircle className="h-4 w-4 text-red-500" />;
    } else if (type === 'jobCard') {
      return status === 'Closed' ? 
        <CheckCircle className="h-4 w-4 text-green-500" /> : 
        <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getBrandingColor = (category) => {
    const colors = {
      'Premium': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Standard': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Basic': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[category] || colors['Basic'];
  };

  const getPlanStatusColor = (status) => {
    const colors = {
      'Service': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Standby': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Maintenance': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status] || colors['Maintenance'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Train Induction Planning</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plan tomorrow's train deployment with AI-powered optimization
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateInductionPlan}
            disabled={loading || trains.length === 0}
            className="px-6 py-2 bg-metro-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span>{loading ? 'Generating...' : 'Generate Plan'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Train ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search train ID..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fitness Status
            </label>
            <select
              value={filters.fitnessStatus}
              onChange={(e) => setFilters({...filters, fitnessStatus: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Card Status
            </label>
            <select
              value={filters.jobCardStatus}
              onChange={(e) => setFilters({...filters, jobCardStatus: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="closed">Closed</option>
              <option value="open">Open</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branding Category
            </label>
            <select
              value={filters.brandingCategory}
              onChange={(e) => setFilters({...filters, brandingCategory: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-metro-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Induction Plan Results */}
      {inductionPlan && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Induction Plan Generated
              </h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => exportPlan('csv')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => exportPlan('pdf')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {inductionPlan.service?.length || 0}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Trains in Service</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {inductionPlan.standby?.length || 0}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Standby Trains</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {inductionPlan.maintenance?.length || 0}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">Maintenance</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Train ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reasoning
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {inductionPlan.all && inductionPlan.all.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.trainId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanStatusColor(item.assignment)}`}>
                        {item.assignment}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.priorityScore.toFixed(1)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.reasoning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Train Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Train Fleet ({filteredTrains.length} of {trains.length})
          </h2>
          <button
            onClick={loadTrainData}
            className="px-4 py-2 text-metro-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Train ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fitness
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job Card
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Branding
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mileage (km)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bay Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cleaning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredTrains.map((train, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {train.trainId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(train.fitnessStatus, 'fitness')}
                      <span className={`text-sm ${train.fitnessStatus === 'Valid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {train.fitnessStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(train.jobCardStatus, 'jobCard')}
                      <span className={`text-sm ${train.jobCardStatus === 'Closed' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {train.jobCardStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBrandingColor(train.brandingCategory)}`}>
                      {train.brandingCategory}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {train.mileage.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {train.bayPosition}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      train.cleaningStatus === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                    }`}>
                      {train.cleaningStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainPlanning;
