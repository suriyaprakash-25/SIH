import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrainPlanning from './pages/TrainPlanning';
import DataInputs from './pages/DataInputs';
import Simulation from './pages/Simulation';
import TrainMonitoring from './pages/TrainMonitoring';
import EngineHealthPage from './pages/EngineHealthPage';
import CleaningPage from './pages/CleaningPage';
import CertificationPage from './pages/CertificationPage';
import BrandingPage from './pages/BrandingPage';
import MaintenancePage from './pages/MaintenancePage';
import ServicePage from './pages/ServicePage';
import JobCardStatusPage from './pages/JobCardStatusPage';
import CleaningMaintenancePage from './pages/CleaningMaintenancePage';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planning" element={<TrainPlanning />} />
            <Route path="/data-inputs" element={<DataInputs />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/monitoring" element={<TrainMonitoring />} />
            <Route path="/engine" element={<EngineHealthPage />} />
            <Route path="/cleaning" element={<CleaningPage />} />
            <Route path="/certification" element={<CertificationPage />} />
            <Route path="/branding" element={<BrandingPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/service" element={<ServicePage />} />
            
            {/* New role-based routes */}
            <Route path="/fitness-certificates" element={<CertificationPage />} />
            <Route path="/job-card-status" element={<JobCardStatusPage />} />
            <Route path="/branding-priorities" element={<BrandingPage />} />
            <Route path="/mileage-monitoring" element={<EngineHealthPage />} />
            <Route path="/communication-management" element={<CleaningPage />} />
            <Route path="/stabling-positions" element={<TrainMonitoring />} />
            <Route path="/cleaning-maintenance" element={<CleaningMaintenancePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;