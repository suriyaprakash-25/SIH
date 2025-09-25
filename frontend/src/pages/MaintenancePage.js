import React, { useState } from 'react';
import { Wrench, Save, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MaintenancePage = () => {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [editMode, setEditMode] = useState(false);

  const [maintenanceData, setMaintenanceData] = useState({
    activeJobs: 2,
    completedJobs: 15,
    pendingParts: 3,
    jobCards: [
      { id: 'JC001', type: 'Brake Inspection', priority: 'high', status: 'active', assignee: 'Tech A' },
      { id: 'JC002', type: 'Motor Service', priority: 'medium', status: 'pending', assignee: 'Tech B' }
    ]
  });

  const trains = ['KMRL-TS-01', 'KMRL-TS-02', 'KMRL-TS-03', 'KMRL-TS-04', 'KMRL-TS-05'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Job Cards</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Job Card
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
            <h3 className="font-medium text-gray-500 mb-2">Active Jobs</h3>
            <div className="text-2xl font-bold text-red-600">{maintenanceData.activeJobs}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Completed Jobs</h3>
            <div className="text-2xl font-bold text-green-600">{maintenanceData.completedJobs}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Pending Parts</h3>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceData.pendingParts}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Efficiency</h3>
            <div className="text-2xl font-bold text-blue-600">87%</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Active Job Cards</h3>
          <div className="space-y-4">
            {maintenanceData.jobCards.map(job => (
              <div key={job.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{job.id} - {job.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to: {job.assignee}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.priority === 'high' ? 'bg-red-100 text-red-800' :
                      job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {job.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;