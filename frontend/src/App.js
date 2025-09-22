import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TrainPlanning from './pages/TrainPlanning';
import DataInputs from './pages/DataInputs';
import Simulation from './pages/Simulation';
import { ThemeProvider } from './utils/ThemeContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <div className="container mx-auto px-6 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/planning" element={<TrainPlanning />} />
                  <Route path="/data-inputs" element={<DataInputs />} />
                  <Route path="/simulation" element={<Simulation />} />
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
