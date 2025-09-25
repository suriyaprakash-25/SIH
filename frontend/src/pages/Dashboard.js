import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Train, Users, Clock, AlertTriangle, TrendingUp, 
  Activity, Battery, MapPin, Zap, Droplets, FileCheck, 
  Palette, Wrench, Gauge, CheckCircle, XCircle
} from 'lucide-react';
import { trainService } from '../services/api';

const Dashboard = () => {
  const [fleetData, setFleetData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic KPI data based on real fleet status
  const [kpiData, setKpiData] = useState({
    totalTrains: 5,
    availableTrains: 3,
    unavailableTrains: 2,
    criticalIssues: 1,
    punctuality: 94.2,
    brandingExposure: 87.5,
    avgMileage: 96700
  });

  useEffect(() => {
    loadFleetData();
  }, []);

  const loadFleetData = async () => {
    try {
      const data = await trainService.getTrains();
      setFleetData(data);
      calculateAvailabilityKPIs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading fleet data:', error);
      setLoading(false);
    }
  };

  const calculateAvailabilityKPIs = (trains) => {
    const availableTrains = trains.filter(train => 
      train.fitnessStatus === 'Valid' && 
      train.jobCard?.status === 'Closed' &&
      train.cleaningStatus === 'Clean'
    ).length;
    
    const criticalIssues = trains.filter(train =>
      train.fitnessStatus === 'Expired' ||
      train.jobCard?.status === 'Open' ||
      train.score < 60
    ).length;

    setKpiData(prev => ({
      ...prev,
      totalTrains: trains.length,
      availableTrains,
      unavailableTrains: trains.length - availableTrains,
      criticalIssues
    }));
  };

  // Dynamic allocation data based on availability
  const getAllocationData = () => [
    { name: 'Available', value: kpiData.availableTrains, color: '#10B981' },
    { name: 'Limited', value: Math.max(0, kpiData.totalTrains - kpiData.availableTrains - kpiData.criticalIssues), color: '#F59E0B' },
    { name: 'Unavailable', value: kpiData.criticalIssues, color: '#EF4444' }
  ];

  // Static weekly performance data
  const weeklyPerformance = [
    { day: 'Mon', punctuality: 95, passengers: 12500 },
    { day: 'Tue', punctuality: 93, passengers: 13200 },
    { day: 'Wed', punctuality: 96, passengers: 12800 },
    { day: 'Thu', punctuality: 92, passengers: 13500 },
    { day: 'Fri', punctuality: 94, passengers: 14200 },
    { day: 'Sat', punctuality: 97, passengers: 11900 },
    { day: 'Sun', punctuality: 95, passengers: 10800 }
  ];

  // Static alerts data
  const alerts = [
    { id: 1, type: 'warning', message: 'Train KMRL-TS-03 has expired Telecom fitness certificate', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Maintenance scheduled for Train KMRL-TS-05 tomorrow', time: '4 hours ago' },
    { id: 3, type: 'success', message: 'All trains completed daily inspection', time: '1 day ago' }
  ];

  const KPICard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Metro fleet overview and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Fleet"
          value={kpiData.totalTrains}
          icon={Train}
          trend="+0 from yesterday"
          color="blue"
        />
        <KPICard
          title="Available"
          value={kpiData.availableTrains}
          icon={CheckCircle}
          trend={`${kpiData.unavailableTrains} unavailable`}
          color="green"
        />
        <KPICard
          title="Critical Issues"
          value={kpiData.criticalIssues}
          icon={AlertTriangle}
          trend="Requires attention"
          color="red"
        />
        <KPICard
          title="Punctuality"
          value={`${kpiData.punctuality}%`}
          icon={Clock}
          trend="+2.1% from last week"
          color="purple"
        />
      </div>

      {/* 6-Factor Availability Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fleet Availability Matrix - 6 Critical Factors</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Train ID</th>
                  <th className="text-center py-3 px-2">
                    <Zap className="w-5 h-5 mx-auto text-red-600" title="Engine Health" />
                  </th>
                  <th className="text-center py-3 px-2">
                    <Droplets className="w-5 h-5 mx-auto text-blue-600" title="Cleanliness" />
                  </th>
                  <th className="text-center py-3 px-2">
                    <FileCheck className="w-5 h-5 mx-auto text-green-600" title="Certificates" />
                  </th>
                  <th className="text-center py-3 px-2">
                    <Palette className="w-5 h-5 mx-auto text-purple-600" title="Branding" />
                  </th>
                  <th className="text-center py-3 px-2">
                    <Wrench className="w-5 h-5 mx-auto text-orange-600" title="Maintenance" />
                  </th>
                  <th className="text-center py-3 px-2">
                    <Gauge className="w-5 h-5 mx-auto text-indigo-600" title="Service Interval" />
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {fleetData.map((train, index) => {
                  const factorStatuses = {
                    engine: train.score > 80 ? 'good' : train.score > 60 ? 'warning' : 'critical',
                    cleaning: train.cleaningStatus === 'Clean' ? 'good' : 'warning',
                    certificates: train.fitnessStatus === 'Valid' ? 'good' : 'critical',
                    branding: train.branding?.category === 'Branded' ? 'good' : 'neutral',
                    maintenance: train.jobCard?.status === 'Closed' ? 'good' : 'critical',
                    mileage: train.mileage < 100000 ? 'good' : 'warning'
                  };
                  
                  const overallStatus = Object.values(factorStatuses).includes('critical') 
                    ? 'critical' 
                    : Object.values(factorStatuses).includes('warning') 
                    ? 'warning' 
                    : 'good';
                  
                  return (
                    <tr key={train.id || index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{train.trainId}</td>
                      {Object.entries(factorStatuses).map(([factor, status]) => (
                        <td key={factor} className="text-center py-3 px-2">
                          {status === 'good' ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-500" />
                          ) : status === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 mx-auto text-yellow-500" />
                          ) : status === 'critical' ? (
                            <XCircle className="w-5 h-5 mx-auto text-red-500" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-300"></div>
                          )}
                        </td>
                      ))}
                      <td className="text-center py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          overallStatus === 'good' 
                            ? 'bg-green-100 text-green-800' 
                            : overallStatus === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {overallStatus === 'good' ? 'AVAILABLE' : overallStatus === 'warning' ? 'LIMITED' : 'UNAVAILABLE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Allocation Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fleet Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={getAllocationData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {getAllocationData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Punctuality</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="punctuality" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'warning' ? 'text-yellow-500' : 
                  alert.type === 'info' ? 'text-blue-500' : 'text-green-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Branding Exposure</span>
              <span className="font-semibold text-gray-900 dark:text-white">{kpiData.brandingExposure}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fleet Utilization</span>
              <span className="font-semibold text-gray-900 dark:text-white">80%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Maintenance Due</span>
              <span className="font-semibold text-red-600 dark:text-red-400">2 trains</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average Age</span>
              <span className="font-semibold text-gray-900 dark:text-white">3.2 years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;