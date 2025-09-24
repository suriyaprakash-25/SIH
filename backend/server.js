const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import our new data service
const { getUnifiedFleetData, getFleetStatistics } = require('./dataService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Metro Induction Planner API',
    version: '2.0.0',
    dataSource: 'Multi-source ingestion system'
  });
});

// NEW: Fleet data endpoint using multi-source data ingestion
app.get('/api/fleet', (req, res) => {
  try {
    console.log('🔄 Fetching unified fleet data...');
    const fleetData = getUnifiedFleetData();
    
    res.json({
      success: true,
      data: fleetData,
      count: fleetData.length,
      timestamp: new Date().toISOString(),
      source: 'Multi-source data ingestion'
    });
    
    console.log(`✅ Successfully served ${fleetData.length} trains`);
  } catch (error) {
    console.error('❌ Error fetching fleet data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fleet data',
      message: error.message
    });
  }
});

// NEW: Fleet statistics endpoint
app.get('/api/fleet/statistics', (req, res) => {
  try {
    const stats = getFleetStatistics();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Fleet statistics served');
  } catch (error) {
    console.error('❌ Error fetching fleet statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fleet statistics',
      message: error.message
    });
  }
});

// Legacy endpoints for backward compatibility
app.get('/api/trains', (req, res) => {
  try {
    const fleetData = getUnifiedFleetData();
    res.json(fleetData);
  } catch (error) {
    console.error('Error in /api/trains:', error);
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

// Planning endpoint (existing functionality)
app.post('/api/planning/generate', (req, res) => {
  try {
    const { filters, priorities } = req.body;
    const fleetData = getUnifiedFleetData();
    
    // Apply filters if provided
    let filteredTrains = fleetData;
    if (filters) {
      if (filters.fitnessStatus) {
        filteredTrains = filteredTrains.filter(train => 
          train.fitnessStatus === filters.fitnessStatus
        );
      }
      if (filters.jobCardStatus) {
        filteredTrains = filteredTrains.filter(train => 
          train.jobCard.status === filters.jobCardStatus
        );
      }
    }
    
    // Sort by score (highest first)
    const plannedTrains = filteredTrains
      .sort((a, b) => b.score - a.score)
      .map((train, index) => ({
        ...train,
        assignedRoute: `Route-${(index % 3) + 1}`,
        scheduledTime: new Date(Date.now() + index * 15 * 60000).toLocaleTimeString(),
        reasoning: `Score: ${train.score}/100. ${train.recommendation}`
      }));
    
    res.json({
      success: true,
      data: plannedTrains,
      generatedAt: new Date().toISOString(),
      totalTrains: plannedTrains.length
    });
    
    console.log(`✅ Generated plan for ${plannedTrains.length} trains`);
  } catch (error) {
    console.error('❌ Error generating plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate plan',
      message: error.message
    });
  }
});

// Train operations endpoints
app.put('/api/trains/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // In a real system, this would update the database
  // For now, we'll just acknowledge the update
  res.json({
    success: true,
    message: `Train ${id} updated successfully`,
    updates: updates,
    timestamp: new Date().toISOString()
  });
  
  console.log(`✅ Train ${id} updated`);
});

app.delete('/api/trains/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Train ${id} deleted successfully`,
    timestamp: new Date().toISOString()
  });
  
  console.log(`✅ Train ${id} deleted`);
});

// Catch-all for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/fleet',
      'GET /api/fleet/statistics',
      'GET /api/trains',
      'POST /api/planning/generate',
      'PUT /api/trains/:id',
      'DELETE /api/trains/:id'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Metro Induction Planner Backend Server Started');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log('🔄 Multi-source data ingestion system active');
  console.log('📊 Available endpoints:');
  console.log('   - GET  /api/health (Health check)');
  console.log('   - GET  /api/fleet (Unified fleet data)');
  console.log('   - GET  /api/fleet/statistics (Fleet stats)');
  console.log('   - GET  /api/trains (Legacy compatibility)');
  console.log('   - POST /api/planning/generate (Generate plans)');
  console.log('   - PUT  /api/trains/:id (Update train)');
  console.log('   - DELETE /api/trains/:id (Delete train)');
  console.log('=====================================');
  
  // Test data ingestion on startup
  try {
    const testData = getUnifiedFleetData();
    console.log(`✅ Data ingestion test successful: ${testData.length} trains loaded`);
  } catch (error) {
    console.error('❌ Data ingestion test failed:', error.message);
  }
});

module.exports = app;
