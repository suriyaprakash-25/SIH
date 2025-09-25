// API service for communicating with the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // For development, return mock data instead of throwing
      if ((endpoint.includes('/trains') || endpoint.includes('/fleet')) && !options.method) {
        return { data: getMockTrains(), success: true };
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

const apiService = new APIService();

// Mock data functions for development
function getMockTrains() {
  return [
    {
      trainId: 'K-101',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 45200,
      bayPosition: 'A1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-15',
      brandingExpiry: '2024-12-31'
    },
    {
      trainId: 'K-102',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 38900,
      bayPosition: 'A2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-10',
      brandingExpiry: '2024-11-30'
    },
    {
      trainId: 'K-103',
      fitnessStatus: 'Expired',
      jobCardStatus: 'Open',
      brandingCategory: 'Basic',
      mileage: 52100,
      bayPosition: 'B1',
      cleaningStatus: 'Pending',
      lastMaintenance: '2024-07-20',
      brandingExpiry: '2024-10-15'
    },
    {
      trainId: 'K-104',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 41800,
      bayPosition: 'B2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-25',
      brandingExpiry: '2025-01-15'
    },
    {
      trainId: 'K-105',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Open',
      brandingCategory: 'Standard',
      mileage: 36200,
      bayPosition: 'C1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-05',
      brandingExpiry: '2024-12-20'
    },
    {
      trainId: 'K-106',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 47300,
      bayPosition: 'C2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-18',
      brandingExpiry: '2025-02-28'
    },
    {
      trainId: 'K-107',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 39500,
      bayPosition: 'D1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-12',
      brandingExpiry: '2024-11-10'
    },
    {
      trainId: 'K-108',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Basic',
      mileage: 33100,
      bayPosition: 'D2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-22',
      brandingExpiry: '2024-12-05'
    },
    {
      trainId: 'K-109',
      fitnessStatus: 'Expired',
      jobCardStatus: 'Open',
      brandingCategory: 'Standard',
      mileage: 48700,
      bayPosition: 'E1',
      cleaningStatus: 'Pending',
      lastMaintenance: '2024-07-15',
      brandingExpiry: '2024-10-01'
    },
    {
      trainId: 'K-110',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 42600,
      bayPosition: 'E2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-28',
      brandingExpiry: '2025-01-20'
    },
    {
      trainId: 'K-111',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 37400,
      bayPosition: 'F1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-08',
      brandingExpiry: '2024-12-15'
    },
    {
      trainId: 'K-112',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Open',
      brandingCategory: 'Basic',
      mileage: 44900,
      bayPosition: 'F2',
      cleaningStatus: 'Pending',
      lastMaintenance: '2024-08-02',
      brandingExpiry: '2024-11-25'
    },
    {
      trainId: 'K-113',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 40100,
      bayPosition: 'G1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-20',
      brandingExpiry: '2025-03-10'
    },
    {
      trainId: 'K-114',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 35800,
      bayPosition: 'G2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-17',
      brandingExpiry: '2024-12-08'
    },
    {
      trainId: 'K-115',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Basic',
      mileage: 43200,
      bayPosition: 'H1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-14',
      brandingExpiry: '2024-11-18'
    },
    {
      trainId: 'K-116',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 38700,
      bayPosition: 'H2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-26',
      brandingExpiry: '2025-02-05'
    },
    {
      trainId: 'K-117',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 41500,
      bayPosition: 'I1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-11',
      brandingExpiry: '2024-12-22'
    },
    {
      trainId: 'K-118',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Basic',
      mileage: 46800,
      bayPosition: 'I2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-07',
      brandingExpiry: '2024-11-03'
    },
    {
      trainId: 'K-119',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 34900,
      bayPosition: 'J1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-29',
      brandingExpiry: '2025-04-12'
    },
    {
      trainId: 'K-120',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 42300,
      bayPosition: 'J2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-16',
      brandingExpiry: '2024-12-28'
    },
    {
      trainId: 'K-121',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Basic',
      mileage: 39800,
      bayPosition: 'K1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-13',
      brandingExpiry: '2024-11-26'
    },
    {
      trainId: 'K-122',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Premium',
      mileage: 37600,
      bayPosition: 'K2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-24',
      brandingExpiry: '2025-01-30'
    },
    {
      trainId: 'K-123',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Standard',
      mileage: 44100,
      bayPosition: 'L1',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-09',
      brandingExpiry: '2024-12-12'
    },
    {
      trainId: 'K-124',
      fitnessStatus: 'Valid',
      jobCardStatus: 'Closed',
      brandingCategory: 'Basic',
      mileage: 36500,
      bayPosition: 'L2',
      cleaningStatus: 'Completed',
      lastMaintenance: '2024-08-21',
      brandingExpiry: '2024-11-14'
    }
  ];
}

function generateMockPlan(trains) {
  if (!trains || trains.length === 0) {
    trains = getMockTrains();
  }

  // Calculate priority scores and sort
  const trainScores = trains.map(train => {
    let score = 100;
    if (train.fitnessStatus === 'Expired') score -= 50;
    if (train.jobCardStatus === 'Open') score -= 30;
    if (train.brandingCategory === 'Premium') score += 20;
    else if (train.brandingCategory === 'Standard') score += 10;
    if (train.cleaningStatus === 'Pending') score -= 15;
    score += Math.random() * 5; // Tie-breaker
    return { ...train, priorityScore: Math.max(0, score) };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const service = [];
  const standby = [];
  const maintenance = [];

  trainScores.forEach(train => {
    let assignment;
    if (train.fitnessStatus === 'Expired') {
      assignment = 'Maintenance';
    } else if (train.priorityScore >= 85 && train.fitnessStatus === 'Valid' && train.jobCardStatus === 'Closed' && service.length < 14) {
      assignment = 'Service';
    } else if (train.priorityScore >= 60 && train.fitnessStatus === 'Valid' && standby.length < 4) {
      assignment = 'Standby';
    } else {
      assignment = 'Maintenance';
    }

    const reasoning = generateReasoning(train, assignment);
    const trainAssignment = {
      trainId: train.trainId,
      assignment,
      priorityScore: train.priorityScore,
      reasoning
    };

    if (assignment === 'Service') service.push(trainAssignment);
    else if (assignment === 'Standby') standby.push(trainAssignment);
    else maintenance.push(trainAssignment);
  });

  const all = [...service, ...standby, ...maintenance];

  return {
    service,
    standby,
    maintenance,
    all,
    generatedAt: new Date().toISOString(),
    totalTrains: trains.length
  };
}

function generateReasoning(train, assignment) {
  if (train.fitnessStatus === 'Expired') {
    return 'Excluded due to expired fitness certificate';
  }
  
  if (train.jobCardStatus === 'Open') {
    if (assignment === 'Maintenance') {
      return 'Assigned to maintenance due to open job card requiring attention';
    } else if (assignment === 'Standby') {
      return 'Limited to standby role due to pending maintenance (open job card)';
    }
  }
  
  if (assignment === 'Service') {
    const reasons = [];
    if (train.brandingCategory === 'Premium') {
      reasons.push('premium branding priority');
    }
    if (train.cleaningStatus === 'Completed') {
      reasons.push('cleaning completed');
    }
    if (train.fitnessStatus === 'Valid') {
      reasons.push('valid fitness certificate');
    }
    
    return `Selected for service due to ${reasons.join(', ')}`;
  }
  
  if (assignment === 'Standby') {
    return 'Assigned to standby for operational flexibility and backup capacity';
  }
  
  if (assignment === 'Maintenance') {
    if (train.cleaningStatus === 'Pending') {
      return 'Scheduled for maintenance including pending cleaning';
    }
    return 'Scheduled for routine maintenance';
  }
  
  return 'Assignment based on operational requirements';
}

// Train service API
export const trainService = {
  async getTrains() {
    try {
      console.log('🔄 Fetching trains from multi-source data system...');
      const response = await apiService.get('/fleet');
      
      // Handle new API response format
      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} trains from backend`);
        return response.data;
      } else {
        // Fallback to legacy format
        return response;
      }
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return getMockTrains();
    }
  },

  async getTrain(trainId) {
    try {
      return await apiService.get(`/trains/${trainId}`);
    } catch (error) {
      console.warn('Backend not available');
      const trains = getMockTrains();
      return trains.find(t => t.trainId === trainId) || null;
    }
  },

  async getFleetStatistics() {
    try {
      const response = await apiService.get('/fleet/statistics');
      if (response.success && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.warn('Backend statistics not available');
      // Generate mock statistics
      const trains = getMockTrains();
      return {
        totalTrains: trains.length,
        readyTrains: trains.filter(t => t.fitnessStatus === 'Valid').length,
        maintenanceNeeded: trains.filter(t => t.jobCardStatus === 'Open').length,
        averageScore: 85
      };
    }
  },

  async updateTrain(trainId, data) {
    try {
      return await apiService.put(`/trains/${trainId}`, data);
    } catch (error) {
      console.error('Failed to update train:', error);
      throw error;
    }
  },

  async generateInductionPlan(trains, constraints = {}) {
    try {
      const response = await apiService.post('/planning/generate', { trains, constraints });
      return response;
    } catch (error) {
      console.warn('Backend not available, generating mock plan');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      return generateMockPlan(trains);
    }
  },

  async runSimulation(baseTrains, scenario) {
    try {
      return await apiService.post('/planning/simulate', { baseTrains, scenario });
    } catch (error) {
      console.warn('Backend not available for simulation');
      throw error;
    }
  },

  exportPlanAsCSV(plan) {
    if (!plan || !plan.all) return;

    const csvContent = [
      ['Train ID', 'Assignment', 'Priority Score', 'Reasoning'],
      ...plan.all.map(item => [
        item.trainId,
        item.assignment,
        item.priorityScore?.toFixed(1) || '0.0',
        item.reasoning || 'No reasoning provided'
      ])
    ];

    const csvString = csvContent.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `induction-plan-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async exportPlanAsPDF(plan) {
    if (!plan || !plan.all) return;

    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Metro Induction Plan', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

      // Summary
      doc.text(`Total Trains: ${plan.all.length}`, 20, 45);
      doc.text(`Service: ${plan.service?.length || 0}`, 20, 55);
      doc.text(`Standby: ${plan.standby?.length || 0}`, 90, 55);
      doc.text(`Maintenance: ${plan.maintenance?.length || 0}`, 160, 55);

      // Table
      const tableData = plan.all.map(item => [
        item.trainId,
        item.assignment,
        item.priorityScore?.toFixed(1) || '0.0',
        item.reasoning?.substring(0, 50) + (item.reasoning?.length > 50 ? '...' : '') || ''
      ]);

      doc.autoTable({
        head: [['Train ID', 'Assignment', 'Priority', 'Reasoning']],
        body: tableData,
        startY: 70,
        styles: { fontSize: 8 },
        columnStyles: {
          3: { cellWidth: 60 }
        }
      });

      doc.save(`induction-plan-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('PDF generation failed. Please try CSV export instead.');
    }
  },

  async exportComparisonReport(originalPlan, simulatedPlan, comparison) {
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Simulation Comparison Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

      // Comparison Summary
      doc.setFontSize(14);
      doc.text('Impact Analysis', 20, 50);
      doc.setFontSize(10);
      
      let yPos = 60;
      Object.entries(comparison).forEach(([key, data]) => {
        if (typeof data === 'object' && data.original !== undefined) {
          const change = data.difference > 0 ? `+${data.difference}` : data.difference.toString();
          doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${data.original} → ${data.simulated} (${change})`, 20, yPos);
          yPos += 10;
        }
      });

      doc.save(`simulation-comparison-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate comparison PDF:', error);
      alert('PDF generation failed.');
    }
  }
};

export default apiService;
