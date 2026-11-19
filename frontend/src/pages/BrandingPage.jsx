import React, { useState } from 'react';
import { Palette, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BrandingPage = () => {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState('KMRL-TS-01');
  const [editMode, setEditMode] = useState(false);

  const [brandingData, setBrandingData] = useState({
    logoCondition: 'good',
    paintWork: 'excellent', 
    advertisingPanels: 'good',
    brandingScore: 88,
    lastUpdate: '2024-01-18'
  });

  const trains = ['KMRL-TS-01', 'KMRL-TS-02', 'KMRL-TS-03', 'KMRL-TS-04', 'KMRL-TS-05'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branding & Visual Status</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Branding Score</h3>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{brandingData.brandingScore}%</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Logo Condition</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">{brandingData.logoCondition}</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Paint Work</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">{brandingData.paintWork}</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-500 mb-2">Ad Panels</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">{brandingData.advertisingPanels}</span>
          </div>
        </div>

        {editMode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Update Branding Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo Condition</label>
                <select 
                  value={brandingData.logoCondition}
                  onChange={(e) => setBrandingData(prev => ({...prev, logoCondition: e.target.value}))}
                  className="w-full p-2 border rounded"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paint Work</label>
                <select 
                  value={brandingData.paintWork}
                  onChange={(e) => setBrandingData(prev => ({...prev, paintWork: e.target.value}))}
                  className="w-full p-2 border rounded"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Advertising Panels</label>
                <select 
                  value={brandingData.advertisingPanels}
                  onChange={(e) => setBrandingData(prev => ({...prev, advertisingPanels: e.target.value}))}
                  className="w-full p-2 border rounded"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandingPage;