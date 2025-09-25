const fs = require('fs');
const path = require('path');

/**
 * Data Service for Metro Induction Planner
 * Reads and merges data from multiple JSON sources to simulate 
 * real-world heterogeneous data ingestion
 */

class DataService {
  constructor() {
    this.dataPath = path.join(__dirname, '..', 'data');
  }

  /**
   * Read JSON file with error handling
   */
  readJsonFile(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.warn(`Warning: Could not read ${filename}:`, error.message);
      return [];
    }
  }

  /**
   * Get unified fleet data by merging all data sources
   */
  getUnifiedFleetData() {
    // Read all data sources
    const fleetMaster = this.readJsonFile('fleet_master.json');
    const certificates = this.readJsonFile('certificates.json');
    const jobCards = this.readJsonFile('job_cards.json');
    const branding = this.readJsonFile('branding.json');

    // Create lookup maps for efficient merging
    const certificateMap = new Map();
    certificates.forEach(cert => {
      certificateMap.set(cert.trainId, cert);
    });

    const jobCardMap = new Map();
    jobCards.forEach(job => {
      jobCardMap.set(job.trainId, job);
    });

    const brandingMap = new Map();
    branding.forEach(brand => {
      brandingMap.set(brand.trainId, brand);
    });

    // Merge data for each train in the fleet master
    const unifiedData = fleetMaster.map(train => {
      // Get certificate data or defaults
      const certificate = certificateMap.get(train.trainId) || {
        type: 'Unknown',
        status: 'Active',
        expiryDays: 30
      };

      // Get job card data or defaults
      const jobCard = jobCardMap.get(train.trainId) || {
        status: 'Closed',
        details: 'No open job cards'
      };

      // Get branding data or defaults
      const brandingInfo = brandingMap.get(train.trainId) || {
        advertiser: 'None',
        slaCompliance: 100
      };

      // Calculate derived fields
      const fitnessStatus = certificate.status === 'Active' && certificate.expiryDays > 0 ? 'Valid' : 'Expired';
      const cleaningStatus = train.lastCleanedDaysAgo <= 3 ? 'Clean' : 'Needs Cleaning';
      
      // Determine priority based on multiple factors
      let priority = 'Low';
      if (jobCard.status === 'Open' || fitnessStatus === 'Expired') {
        priority = 'High';
      } else if (train.lastCleanedDaysAgo > 7 || brandingInfo.slaCompliance < 100) {
        priority = 'Medium';
      }

      // Return unified train object
      return {
        id: train.trainId,
        trainId: train.trainId,
        mileage: train.mileage,
        bayPosition: train.bayPosition,
        lastCleanedDaysAgo: train.lastCleanedDaysAgo,
        cleaningStatus,
        fitnessStatus,
        fitnessCertificate: {
          type: certificate.type,
          status: certificate.status,
          expiryDays: certificate.expiryDays
        },
        jobCard: {
          status: jobCard.status,
          details: jobCard.details
        },
        branding: {
          category: brandingInfo.advertiser !== 'None' ? 'Branded' : 'Non-Branded',
          advertiser: brandingInfo.advertiser,
          slaCompliance: brandingInfo.slaCompliance
        },
        priority,
        // Additional computed fields for dashboard
        score: this.calculateTrainScore(train, certificate, jobCard, brandingInfo),
        recommendation: this.getRecommendation(train, certificate, jobCard, brandingInfo, cleaningStatus)
      };
    });

    console.log(`✅ Data Service: Successfully merged data for ${unifiedData.length} trains`);
    return unifiedData;
  }

  /**
   * Calculate a composite score for train readiness
   */
  calculateTrainScore(train, certificate, jobCard, branding) {
    let score = 100;

    // Deduct for expired certificates
    if (certificate.status === 'Expired' || certificate.expiryDays < 0) {
      score -= 30;
    } else if (certificate.expiryDays < 15) {
      score -= 10;
    }

    // Deduct for open job cards
    if (jobCard.status === 'Open') {
      score -= 25;
    }

    // Deduct for cleaning issues
    if (train.lastCleanedDaysAgo > 7) {
      score -= 15;
    } else if (train.lastCleanedDaysAgo > 3) {
      score -= 5;
    }

    // Adjust for branding SLA
    if (branding.slaCompliance < 95) {
      score -= 10;
    } else if (branding.slaCompliance > 100) {
      score += 5;
    }

    // Mileage factor (higher mileage = more maintenance needs)
    if (train.mileage > 100000) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get recommendation based on train status
   */
  getRecommendation(train, certificate, jobCard, branding, cleaningStatus) {
    const issues = [];

    if (certificate.status === 'Expired' || certificate.expiryDays < 0) {
      issues.push('Renew fitness certificate');
    }

    if (jobCard.status === 'Open') {
      issues.push('Complete maintenance work');
    }

    if (train.lastCleanedDaysAgo > 7) {
      issues.push('Schedule deep cleaning');
    } else if (train.lastCleanedDaysAgo > 3) {
      issues.push('Schedule routine cleaning');
    }

    if (branding.slaCompliance < 95) {
      issues.push('Address branding SLA issues');
    }

    if (issues.length === 0) {
      return 'Ready for service';
    }

    return issues.join('; ');
  }

  /**
   * Get fleet statistics
   */
  getFleetStatistics() {
    const fleetData = this.getUnifiedFleetData();
    
    const stats = {
      totalTrains: fleetData.length,
      readyTrains: fleetData.filter(t => t.fitnessStatus === 'Valid' && t.jobCard.status === 'Closed').length,
      maintenanceNeeded: fleetData.filter(t => t.jobCard.status === 'Open').length,
      cleaningNeeded: fleetData.filter(t => t.cleaningStatus === 'Needs Cleaning').length,
      expiredCertificates: fleetData.filter(t => t.fitnessStatus === 'Expired').length,
      averageScore: Math.round(fleetData.reduce((sum, t) => sum + t.score, 0) / fleetData.length),
      brandedTrains: fleetData.filter(t => t.branding.category === 'Branded').length
    };

    return stats;
  }
}

// Export singleton instance
const dataService = new DataService();

module.exports = {
  getUnifiedFleetData: () => dataService.getUnifiedFleetData(),
  getFleetStatistics: () => dataService.getFleetStatistics()
};
