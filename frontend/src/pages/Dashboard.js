import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Activity, 
  Eye, 
  Gauge, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const Dashboard = () => {
  const [kpiData, setKpiData] = useState({
    totalTrains: 24,
    availableTrains: 18,
    standbyTrains: 4,
    maintenanceTrains: 2,
    punctualityKPI: 94.2,
    brandingExposure: 78.5,
    avgMileage: 245.8
  });

  const [allocationData, setAllocationData] = useState([
    { name: 'Service', value: 18, color: '#10b981' },
    { name: 'Standby', value: 4, color: '#f59e0b' },
    { name: 'Maintenance', value: 2, color: '#ef4444' }
  ]);

  const [weeklyPerformance, setWeeklyPerformance] = useState([
    { day: 'Mon', punctuality: 96, mileage: 240 },
    { day: 'Tue', punctuality: 94, mileage: 250 },
    { day: 'Wed', punctuality: 92, mileage: 245 },
    { day: 'Thu', punctuality: 95, mileage: 255 },
    { day: 'Fri', punctuality: 93, mileage: 248 },
    { day: 'Sat', punctuality: 97, mileage: 235 },
    { day: 'Sun', punctuality: 98, mileage: 230 }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Train K-105 fitness certificate expires in 2 days', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Successfully generated induction plan for tomorrow', time: '4 hours ago' },
    { id: 3, type: 'error', message: 'Train K-112 job-card still open - maintenance required', time: '6 hours ago' }
  ]);

  const KPICard = ({ title, value, icon: Icon, trend, color = 'blue', suffix = '' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold mt-2 text-${color}-600 dark:text-${color}-400`}>
            {value}{suffix}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}% from last week
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const AlertItem = ({ alert }) => {
    const getAlertColor = (type) => {
      switch (type) {
        case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
        case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
        case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
        default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      }
    };

    const getAlertIcon = (type) => {
      switch (type) {
        case 'error': return AlertTriangle;
        case 'warning': return AlertTriangle;
        case 'info': return CheckCircle;
        default: return Clock;
      }
    };

    const Icon = getAlertIcon(alert.type);

    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
        <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Metro Induction Planning Overview - {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-metro-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Live Status</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Fleet Size"
          value={kpiData.totalTrains}
          icon={Train}
          trend={0}
          color="blue"
        />
        <KPICard
          title="Punctuality"
          value={kpiData.punctualityKPI}
          icon={Activity}
          trend={2.1}
          color="green"
          suffix="%"
        />
        <KPICard
          title="Branding Exposure"
          value={kpiData.brandingExposure}
          icon={Eye}
          trend={-1.2}
          color="purple"
          suffix="%"
        />
        <KPICard
          title="Avg. Mileage"
          value={kpiData.avgMileage}
          icon={Gauge}
          trend={1.8}
          color="orange"
          suffix=" km"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Train Allocation Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Train Allocation
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Performance Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="punctuality" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Punctuality (%)"
              />
              <Line 
                type="monotone" 
                dataKey="mileage" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Avg Mileage (km)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Fleet Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { category: 'Available', count: kpiData.availableTrains, color: '#10b981' },
              { category: 'Standby', count: kpiData.standbyTrains, color: '#f59e0b' },
              { category: 'Maintenance', count: kpiData.maintenanceTrains, color: '#ef4444' }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Alerts
          </h2>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            View all alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
