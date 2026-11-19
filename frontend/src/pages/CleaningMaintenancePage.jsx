import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Wrench, Droplets, 
         Sparkles, FileText, User, BarChart3, RefreshCw, Filter, Search } from 'lucide-react';

const CleaningMaintenancePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [cleaningData, setCleaningData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadCleaningMaintenanceData();
  }, []);

  const loadCleaningMaintenanceData = () => {
    // Mock data for cleaning and maintenance operations
    const mockCleaningData = [
      {
        id: 'CLN-001',
        trainId: 'KMRL-TS-01',
        carNumber: 'KMRL-MC-01A',
        type: 'Deep Cleaning',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'Team Alpha',
        startTime: '08:00',
        estimatedEnd: '10:00',
        location: 'Bay 1',
        completionRate: 75
      },
      {
        id: 'CLN-002',
        trainId: 'KMRL-TS-02',
        carNumber: 'KMRL-TC-02B',
        type: 'Routine Cleaning',
        status: 'Completed',
        priority: 'Medium',
        assignedTo: 'Team Beta',
        startTime: '06:00',
        estimatedEnd: '07:30',
        location: 'Bay 3',
        completionRate: 100
      },
      {
        id: 'CLN-003',
        trainId: 'KMRL-TS-03',
        carNumber: 'KMRL-MC-03C',
        type: 'Sanitization',
        status: 'Scheduled',
        priority: 'High',
        assignedTo: 'Team Gamma',
        startTime: '14:00',
        estimatedEnd: '15:30',
        location: 'Bay 2',
        completionRate: 0
      }
    ];

    const mockMaintenanceData = [
      {
        id: 'MNT-001',
        trainId: 'KMRL-TS-01',
        carNumber: 'KMRL-MC-01A',
        type: 'Preventive Maintenance',
        component: 'Air Conditioning',
        status: 'In Progress',
        priority: 'High',
        technician: 'John Smith',
        startDate: '2024-01-15',
        estimatedCompletion: '2024-01-16',
        completionRate: 60
      },
      {
        id: 'MNT-002',
        trainId: 'KMRL-TS-02',
        carNumber: 'KMRL-TC-02B',
        type: 'Corrective Maintenance',
        component: 'Door System',
        status: 'Completed',
        priority: 'Critical',
        technician: 'Maria Garcia',
        startDate: '2024-01-14',
        estimatedCompletion: '2024-01-14',
        completionRate: 100
      },
      {
        id: 'MNT-003',
        trainId: 'KMRL-TS-03',
        carNumber: 'KMRL-MC-03C',
        type: 'Inspection',
        component: 'Brake System',
        status: 'Scheduled',
        priority: 'Medium',
        technician: 'Raj Kumar',
        startDate: '2024-01-17',
        estimatedCompletion: '2024-01-17',
        completionRate: 0
      }
    ];

    setCleaningData(mockCleaningData);
    setMaintenanceData(mockMaintenanceData);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCleaningData = cleaningData.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredMaintenanceData = maintenanceData.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.component.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Sparkles className="mr-3 h-8 w-8 text-blue-600" />
                Cleaning & Maintenance Management
              </h1>
              <p className="text-gray-600 mt-2">Integrated cleaning and maintenance operations for KMRL fleet</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cleaning</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cleaningData.filter(item => item.status === 'In Progress').length}
                </p>
              </div>
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ongoing Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {maintenanceData.filter(item => item.status === 'In Progress').length}
                </p>
              </div>
              <Wrench className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {[...cleaningData, ...maintenanceData].filter(item => item.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled Tasks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {[...cleaningData, ...maintenanceData].filter(item => item.status === 'Scheduled').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by train, car, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'cleaning', name: 'Cleaning Operations', icon: Droplets },
                { id: 'maintenance', name: 'Maintenance Tasks', icon: Wrench }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Cleaning Activities */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                      Recent Cleaning Activities
                    </h3>
                    <div className="space-y-3">
                      {cleaningData.slice(0, 3).map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{item.trainId} - {item.carNumber}</p>
                              <p className="text-xs text-gray-500">{item.type}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.status === 'In Progress' && (
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${item.completionRate}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{item.completionRate}% complete</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Maintenance Activities */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Wrench className="mr-2 h-5 w-5 text-orange-500" />
                      Recent Maintenance Activities
                    </h3>
                    <div className="space-y-3">
                      {maintenanceData.slice(0, 3).map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{item.trainId} - {item.carNumber}</p>
                              <p className="text-xs text-gray-500">{item.component}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.status === 'In Progress' && (
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${item.completionRate}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{item.completionRate}% complete</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cleaning' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Train/Car
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCleaningData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.trainId}</div>
                              <div className="text-sm text-gray-500">{item.carNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(item.priority)}`}></div>
                              <span className="text-sm text-gray-900">{item.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.assignedTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${item.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">{item.completionRate}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.location}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Train/Car
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Component
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Technician
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMaintenanceData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.trainId}</div>
                              <div className="text-sm text-gray-500">{item.carNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.component}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(item.priority)}`}></div>
                              <span className="text-sm text-gray-900">{item.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.technician}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${item.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">{item.completionRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningMaintenancePage;