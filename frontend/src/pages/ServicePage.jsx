import React, { useState } from 'react';
import { Clock, Save, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ServicePage = () => {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [editMode, setEditMode] = useState(false);

  const [serviceData, setServiceData] = useState({
    nextService: '2024-02-15',
    lastService: '2024-01-15',
    serviceType: 'routine',
    intervalDays: 30,
    mileage: 45000,
    serviceScore: 92,
    upcomingServices: [
      { type: 'Routine Check', date: '2024-02-15', mileage: 46000 },
      { type: 'Major Service', date: '2024-03-15', mileage: 48000 },
      { type: 'Annual Inspection', date: '2024-06-15', mileage: 52000 }
    ]
  });

  const trains = ['KMRL-TS-01', 'KMRL-TS-02', 'KMRL-TS-03', 'KMRL-TS-04', 'KMRL-TS-05'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Intervals</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-medium ${
                editMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {editMode ? 'Save Changes' : 'Edit Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Train</h2>
          <div className="flex space-x-3">
            {trains.map(train => (
              <button
                key={train}
                onClick={() => setSelectedTrain(train)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedTrain === train ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {train}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Service Score</h3>
            <div className="text-2xl font-bold text-green-600">{serviceData.serviceScore}%</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Current Mileage</h3>
            <div className="text-2xl font-bold text-blue-600">{serviceData.mileage.toLocaleString()}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Last Service</h3>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{serviceData.lastService}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Next Service</h3>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{serviceData.nextService}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Services</h3>
          <div className="space-y-4">
            {serviceData.upcomingServices.map((service, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{service.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Scheduled: {service.date} | At {service.mileage.toLocaleString()} km
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{service.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editMode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Update Service Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Next Service Date</label>
                <input
                  type="date"
                  value={serviceData.nextService}
                  onChange={(e) => setServiceData(prev => ({...prev, nextService: e.target.value}))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Mileage</label>
                <input
                  type="number"
                  value={serviceData.mileage}
                  onChange={(e) => setServiceData(prev => ({...prev, mileage: parseInt(e.target.value)}))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Interval (Days)</label>
                <input
                  type="number"
                  value={serviceData.intervalDays}
                  onChange={(e) => setServiceData(prev => ({...prev, intervalDays: parseInt(e.target.value)}))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;