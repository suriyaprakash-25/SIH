import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Save, 
  Download, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus
} from 'lucide-react';
import { trainService } from '../services/api';

const Simulation = () => {
  const [trains, setTrains] = useState([]);
  const [simulationScenario, setSimulationScenario] = useState({
    excludedTrains: [],
    modifiedTrains: [],
    emergencyMaintenance: [],
    additionalConstraints: {}
  });
  const [originalPlan, setOriginalPlan] = useState(null);
  const [simulatedPlan, setSimulatedPlan] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrainData();
  }, []);

  const loadTrainData = async () => {
    try {
      const data = await trainService.getTrains();
      setTrains(data);
      
      // Generate baseline plan
      const baseline = await trainService.generateInductionPlan(data);
      setOriginalPlan(baseline);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      // Apply simulation constraints
      const modifiedTrains = trains.map(train => {
        if (simulationScenario.excludedTrains.includes(train.trainId)) {
          return { ...train, availability: 'Excluded' };
        }
        
        const modification = simulationScenario.modifiedTrains.find(mod => mod.trainId === train.trainId);
        if (modification) {
          return { ...train, ...modification.changes };
        }
        
        if (simulationScenario.emergencyMaintenance.includes(train.trainId)) {
          return { ...train, fitnessStatus: 'Emergency Maintenance Required' };
        }
        
        return train;
      });

      // Generate new plan with constraints
      const simPlan = await trainService.generateInductionPlan(modifiedTrains);
      setSimulatedPlan(simPlan);
      
      // Generate comparison
      generateComparison(originalPlan, simPlan);
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateComparison = (original, simulated) => {
    const originalCounts = {
      service: original?.service?.length || 0,
      standby: original?.standby?.length || 0,
      maintenance: original?.maintenance?.length || 0
    };

    const simulatedCounts = {
      service: simulated?.service?.length || 0,
      standby: simulated?.standby?.length || 0,
      maintenance: simulated?.maintenance?.length || 0
    };

    const comparison = {
      service: {
        original: originalCounts.service,
        simulated: simulatedCounts.service,
        difference: simulatedCounts.service - originalCounts.service
      },
      standby: {
        original: originalCounts.standby,
        simulated: simulatedCounts.standby,
        difference: simulatedCounts.standby - originalCounts.standby
      },
      maintenance: {
        original: originalCounts.maintenance,
        simulated: simulatedCounts.maintenance,
        difference: simulatedCounts.maintenance - originalCounts.maintenance
      },
      totalAvailable: {
        original: originalCounts.service + originalCounts.standby,
        simulated: simulatedCounts.service + simulatedCounts.standby,
        difference: (simulatedCounts.service + simulatedCounts.standby) - (originalCounts.service + originalCounts.standby)
      }
    };

    setComparison(comparison);
  };

  const addExcludedTrain = (trainId) => {
    if (!simulationScenario.excludedTrains.includes(trainId)) {
      setSimulationScenario({
        ...simulationScenario,
        excludedTrains: [...simulationScenario.excludedTrains, trainId]
      });
    }
  };

  const removeExcludedTrain = (trainId) => {
    setSimulationScenario({
      ...simulationScenario,
      excludedTrains: simulationScenario.excludedTrains.filter(id => id !== trainId)
    });
  };

  const addEmergencyMaintenance = (trainId) => {
    if (!simulationScenario.emergencyMaintenance.includes(trainId)) {
      setSimulationScenario({
        ...simulationScenario,
        emergencyMaintenance: [...simulationScenario.emergencyMaintenance, trainId]
      });
    }
  };

  const removeEmergencyMaintenance = (trainId) => {
    setSimulationScenario({
      ...simulationScenario,
      emergencyMaintenance: simulationScenario.emergencyMaintenance.filter(id => id !== trainId)
    });
  };

  const resetSimulation = () => {
    setSimulationScenario({
      excludedTrains: [],
      modifiedTrains: [],
      emergencyMaintenance: [],
      additionalConstraints: {}
    });
    setSimulatedPlan(null);
    setComparison(null);
  };

  const exportComparison = () => {
    if (!comparison) return;
    trainService.exportComparisonReport(originalPlan, simulatedPlan, comparison);
  };

  const ComparisonCard = ({ title, data, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        {data.difference !== 0 && (
          <div className={`flex items-center ${data.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.difference > 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {data.difference > 0 ? '+' : ''}{data.difference}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Original:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.original}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Simulated:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.simulated}</span>
        </div>
      </div>
    </div>
  );

  const QuickScenarioButton = ({ label, onClick, description }) => (
    <button
      onClick={onClick}
      className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
    >
      <div className="font-medium text-gray-900 dark:text-white mb-1">{label}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simulation & What-If Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Test different scenarios and see their impact on train planning
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={runSimulation}
            disabled={loading}
            className="px-6 py-2 bg-metro-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {loading ? <Settings className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span>{loading ? 'Running...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Scenarios */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Scenarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickScenarioButton
                label="Train Breakdown"
                description="Remove K-105 from service due to breakdown"
                onClick={() => {
                  addExcludedTrain('K-105');
                  addEmergencyMaintenance('K-105');
                }}
              />
              <QuickScenarioButton
                label="Peak Hour Demand"
                description="Increase service trains by 20%"
                onClick={() => {
                  // This would modify the constraints
                  setSimulationScenario({
                    ...simulationScenario,
                    additionalConstraints: { minServiceTrains: Math.ceil((originalPlan?.service?.length || 0) * 1.2) }
                  });
                }}
              />
              <QuickScenarioButton
                label="Reduced Fleet"
                description="Remove 3 trains for long-term maintenance"
                onClick={() => {
                  const trainsToExclude = ['K-103', 'K-107', 'K-112'];
                  setSimulationScenario({
                    ...simulationScenario,
                    excludedTrains: [...simulationScenario.excludedTrains, ...trainsToExclude.filter(id => !simulationScenario.excludedTrains.includes(id))]
                  });
                }}
              />
              <QuickScenarioButton
                label="Emergency Response"
                description="Maximum available trains for service"
                onClick={() => {
                  setSimulationScenario({
                    ...simulationScenario,
                    additionalConstraints: { emergencyMode: true, minStandbyTrains: 1 }
                  });
                }}
              />
            </div>
          </div>

          {/* Manual Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manual Configuration</h2>
            
            {/* Excluded Trains */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Exclude Trains from Service</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {trains.map(train => (
                  <button
                    key={train.trainId}
                    onClick={() => {
                      if (simulationScenario.excludedTrains.includes(train.trainId)) {
                        removeExcludedTrain(train.trainId);
                      } else {
                        addExcludedTrain(train.trainId);
                      }
                    }}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                      simulationScenario.excludedTrains.includes(train.trainId)
                        ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {train.trainId}
                  </button>
                ))}
              </div>
              {simulationScenario.excludedTrains.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Excluded: {simulationScenario.excludedTrains.join(', ')}
                </div>
              )}
            </div>

            {/* Emergency Maintenance */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Emergency Maintenance Required</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {trains.filter(train => !simulationScenario.excludedTrains.includes(train.trainId)).map(train => (
                  <button
                    key={train.trainId}
                    onClick={() => {
                      if (simulationScenario.emergencyMaintenance.includes(train.trainId)) {
                        removeEmergencyMaintenance(train.trainId);
                      } else {
                        addEmergencyMaintenance(train.trainId);
                      }
                    }}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                      simulationScenario.emergencyMaintenance.includes(train.trainId)
                        ? 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/20 dark:border-orange-600 dark:text-orange-400'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {train.trainId}
                  </button>
                ))}
              </div>
              {simulationScenario.emergencyMaintenance.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Emergency maintenance: {simulationScenario.emergencyMaintenance.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Simulation Results */}
          {simulatedPlan && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Simulation Results</h2>
                <button
                  onClick={exportComparison}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Train ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Original Assignment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Simulated Assignment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {trains.map(train => {
                      const originalAssignment = originalPlan?.all?.find(item => item.trainId === train.trainId)?.assignment || 'Unknown';
                      const simulatedAssignment = simulatedPlan?.all?.find(item => item.trainId === train.trainId)?.assignment || 'Unknown';
                      const hasChanged = originalAssignment !== simulatedAssignment;
                      
                      return (
                        <tr key={train.trainId} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${hasChanged ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {train.trainId}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {originalAssignment}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {simulatedAssignment}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {hasChanged ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <Minus className="h-4 w-4 text-gray-400" />
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {simulationScenario.excludedTrains.includes(train.trainId) 
                              ? 'Excluded from service'
                              : simulationScenario.emergencyMaintenance.includes(train.trainId)
                              ? 'Emergency maintenance required'
                              : hasChanged 
                              ? 'Reassigned due to constraints'
                              : 'No change'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Panel */}
        <div className="space-y-6">
          {comparison && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Impact Analysis</h2>
                <div className="space-y-4">
                  <ComparisonCard title="Service Trains" data={comparison.service} color="green" />
                  <ComparisonCard title="Standby Trains" data={comparison.standby} color="yellow" />
                  <ComparisonCard title="Maintenance" data={comparison.maintenance} color="red" />
                  <ComparisonCard title="Total Available" data={comparison.totalAvailable} color="blue" />
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h2>
                <div className="space-y-3">
                  {comparison.totalAvailable.difference < 0 && (
                    <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="text-sm text-red-800 dark:text-red-300">
                        <strong>Service Impact:</strong> {Math.abs(comparison.totalAvailable.difference)} fewer trains available for passenger service.
                      </div>
                    </div>
                  )}
                  
                  {comparison.service.difference < -2 && (
                    <div className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div className="text-sm text-orange-800 dark:text-orange-300">
                        <strong>Capacity Warning:</strong> Significant reduction in service capacity may affect passenger operations.
                      </div>
                    </div>
                  )}
                  
                  {comparison.standby.difference < 0 && (
                    <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-300">
                        <strong>Backup Concern:</strong> Reduced standby capacity limits flexibility for unexpected demand.
                      </div>
                    </div>
                  )}
                  
                  {simulationScenario.excludedTrains.length === 0 && simulationScenario.emergencyMaintenance.length === 0 && (
                    <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Baseline:</strong> No constraints applied. This shows the optimal allocation.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Current Scenario Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Scenario</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Excluded trains:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {simulationScenario.excludedTrains.length || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Emergency maintenance:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {simulationScenario.emergencyMaintenance.length || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total fleet:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {trains.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Available for planning:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {trains.length - simulationScenario.excludedTrains.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
