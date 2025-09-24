import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Train, Users, Clock, AlertTriangle, TrendingUp, 
  Activity, Battery, MapPin
} from 'lucide-react';

const Dashboard = () => {
  // Static KPI data for demo
  const kpiData = {
    totalTrains: 5,
    inService: 3,
    standby: 1,
    maintenance: 1,
    punctuality: 94.2,
    brandingExposure: 87.5,
    avgMileage: 96700
  };

  // Static allocation data
  const allocationData = [
    { name: 'In Service', value: 3, color: '#10B981' },
    { name: 'Standby', value: 1, color: '#F59E0B' },
    { name: 'Maintenance', value: 1, color: '#EF4444' }
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
          title="In Service"
          value={kpiData.inService}
          icon={Users}
          trend="+1 from yesterday"
          color="green"
        />
        <KPICard
          title="Punctuality"
          value={`${kpiData.punctuality}%`}
          icon={Clock}
          trend="+2.1% from last week"
          color="purple"
        />
        <KPICard
          title="Avg. Mileage"
          value={`${(kpiData.avgMileage / 1000).toFixed(0)}K km`}
          icon={MapPin}
          trend="+5K from last month"
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Allocation Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fleet Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
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