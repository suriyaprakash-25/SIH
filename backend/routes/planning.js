const express = require('express');
const router = express.Router();
const trainData = require('../data/mockTrains.json');

// Induction Planning Engine
class InductionPlannerEngine {
  
  static calculatePriorityScore(train) {
    let score = 100; // Base score
    
    // Fitness certificate (highest priority)
    if (train.fitnessStatus === 'Expired') {
      score -= 50; // Major penalty for expired fitness
    }
    
    // Job card status
    if (train.jobCardStatus === 'Open') {
      score -= 30; // Significant penalty for open job cards
    }
    
    // Branding priority
    const brandingScores = {
      'Premium': 20,
      'Standard': 10,
      'Basic': 0
    };
    score += brandingScores[train.brandingCategory] || 0;
    
    // Mileage balancing (prefer lower mileage for service)
    const avgMileage = 42000; // Fleet average
    const mileageDiff = train.mileage - avgMileage;
    score -= mileageDiff * 0.001; // Small penalty for high mileage
    
    // Cleaning status
    if (train.cleaningStatus === 'Pending') {
      score -= 15;
    }
    
    // Randomization for tie-breaking
    score += Math.random() * 5;
    
    return Math.max(0, score);
  }
  
  static generateReasoning(train, assignment) {
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
  
  static generateInductionPlan(trains, constraints = {}) {
    // Calculate priority scores for all trains
    const trainScores = trains.map(train => ({
      ...train,
      priorityScore: this.calculatePriorityScore(train)
    }));
    
    // Sort by priority score (highest first)
    trainScores.sort((a, b) => b.priorityScore - a.priorityScore);
    
    const plan = {
      service: [],
      standby: [],
      maintenance: [],
      all: []
    };
    
    // Apply constraints
    const minServiceTrains = constraints.minServiceTrains || 14;
    const minStandbyTrains = constraints.minStandbyTrains || 3;
    const emergencyMode = constraints.emergencyMode || false;
    
    // Apply allocation rules
    trainScores.forEach(train => {
      let assignment;
      
      // Apply exclusions from constraints
      if (constraints.excludedTrains && constraints.excludedTrains.includes(train.trainId)) {
        assignment = 'Maintenance';
      }
      // Emergency maintenance
      else if (constraints.emergencyMaintenance && constraints.emergencyMaintenance.includes(train.trainId)) {
        assignment = 'Maintenance';
      }
      // Exclusion rules
      else if (train.fitnessStatus === 'Expired') {
        assignment = 'Maintenance';
      }
      // Emergency mode - maximize service trains
      else if (emergencyMode && train.fitnessStatus === 'Valid' && plan.service.length < 18) {
        assignment = 'Service';
      }
      // High-priority service allocation
      else if (
        train.priorityScore >= 85 && 
        train.fitnessStatus === 'Valid' && 
        train.jobCardStatus === 'Closed' &&
        plan.service.length < minServiceTrains + 2
      ) {
        assignment = 'Service';
      }
      // Standby allocation
      else if (
        train.priorityScore >= 60 && 
        train.fitnessStatus === 'Valid' &&
        plan.standby.length < (emergencyMode ? minStandbyTrains : 4)
      ) {
        assignment = 'Standby';
      }
      // Default to maintenance
      else {
        assignment = 'Maintenance';
      }
      
      const trainAssignment = {
        trainId: train.trainId,
        assignment,
        priorityScore: train.priorityScore,
        reasoning: this.generateReasoning(train, assignment)
      };
      
      plan[assignment.toLowerCase()].push(trainAssignment);
      plan.all.push(trainAssignment);
    });
    
    return plan;
  }
}

// POST /api/planning/generate - Generate induction plan
router.post('/generate', (req, res) => {
  try {
    const { trains, constraints } = req.body;
    const inputTrains = trains || trainData;
    
    const plan = InductionPlannerEngine.generateInductionPlan(inputTrains, constraints);
    
    res.json({
      ...plan,
      generatedAt: new Date().toISOString(),
      totalTrains: inputTrains.length,
      constraints: constraints || {}
    });
  } catch (error) {
    console.error('Error generating induction plan:', error);
    res.status(500).json({ error: 'Failed to generate induction plan' });
  }
});

// POST /api/planning/simulate - Run simulation with constraints
router.post('/simulate', (req, res) => {
  try {
    const { baseTrains, scenario } = req.body;
    const inputTrains = baseTrains || trainData;
    
    // Apply scenario modifications
    const modifiedTrains = inputTrains.map(train => {
      if (scenario.excludedTrains && scenario.excludedTrains.includes(train.trainId)) {
        return { ...train, availability: 'Excluded' };
      }
      
      if (scenario.emergencyMaintenance && scenario.emergencyMaintenance.includes(train.trainId)) {
        return { ...train, fitnessStatus: 'Emergency Maintenance Required' };
      }
      
      const modification = scenario.modifiedTrains && scenario.modifiedTrains.find(mod => mod.trainId === train.trainId);
      if (modification) {
        return { ...train, ...modification.changes };
      }
      
      return train;
    });
    
    // Generate plans
    const originalPlan = InductionPlannerEngine.generateInductionPlan(inputTrains);
    const simulatedPlan = InductionPlannerEngine.generateInductionPlan(modifiedTrains, scenario.additionalConstraints);
    
    // Generate comparison
    const comparison = {
      service: {
        original: originalPlan.service.length,
        simulated: simulatedPlan.service.length,
        difference: simulatedPlan.service.length - originalPlan.service.length
      },
      standby: {
        original: originalPlan.standby.length,
        simulated: simulatedPlan.standby.length,
        difference: simulatedPlan.standby.length - originalPlan.standby.length
      },
      maintenance: {
        original: originalPlan.maintenance.length,
        simulated: simulatedPlan.maintenance.length,
        difference: simulatedPlan.maintenance.length - originalPlan.maintenance.length
      }
    };
    
    res.json({
      originalPlan,
      simulatedPlan,
      comparison,
      scenario,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    res.status(500).json({ error: 'Failed to run simulation' });
  }
});

// GET /api/planning/optimize - Get optimization suggestions
router.get('/optimize', (req, res) => {
  try {
    const currentPlan = InductionPlannerEngine.generateInductionPlan(trainData);
    
    const suggestions = [
      {
        type: 'efficiency',
        title: 'Mileage Optimization',
        description: 'Consider rotating high-mileage trains to maintenance for better fleet longevity',
        impact: 'Medium',
        trains: trainData.filter(t => t.mileage > 45000).map(t => t.trainId)
      },
      {
        type: 'capacity',
        title: 'Branding Exposure',
        description: 'Prioritize premium-branded trains for high-visibility routes',
        impact: 'Low',
        trains: trainData.filter(t => t.brandingCategory === 'Premium').map(t => t.trainId)
      }
    ];
    
    res.json({
      currentPlan: {
        service: currentPlan.service.length,
        standby: currentPlan.standby.length,
        maintenance: currentPlan.maintenance.length
      },
      suggestions,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    res.status(500).json({ error: 'Failed to get optimization suggestions' });
  }
});

module.exports = router;
