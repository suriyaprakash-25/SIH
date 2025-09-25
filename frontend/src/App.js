import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TrainPlanning from './pages/TrainPlanning';
import DataInputs from './pages/DataInputs';
import Simulation from './pages/Simulation';
import TrainMonitoring from './pages/TrainMonitoring';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="container mx-auto px-4 py-8 lg:px-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/planning" element={<TrainPlanning />} />
                  <Route path="/data-inputs" element={<DataInputs />} />
                  <Route path="/simulation" element={<Simulation />} />
                  <Route path="/monitoring" element={<TrainMonitoring />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;