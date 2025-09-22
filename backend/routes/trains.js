const express = require('express');
const router = express.Router();
const trainData = require('../data/mockTrains.json');

// GET /api/trains - Get all trains
router.get('/', (req, res) => {
  try {
    res.json(trainData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch train data' });
  }
});

// GET /api/trains/:id - Get specific train
router.get('/:id', (req, res) => {
  try {
    const train = trainData.find(t => t.trainId === req.params.id);
    if (!train) {
      return res.status(404).json({ error: 'Train not found' });
    }
    res.json(train);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch train data' });
  }
});

// PUT /api/trains/:id - Update train data
router.put('/:id', (req, res) => {
  try {
    const trainIndex = trainData.findIndex(t => t.trainId === req.params.id);
    if (trainIndex === -1) {
      return res.status(404).json({ error: 'Train not found' });
    }
    
    trainData[trainIndex] = { ...trainData[trainIndex], ...req.body };
    res.json(trainData[trainIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update train data' });
  }
});

// GET /api/trains/filters/available - Get available trains only
router.get('/filters/available', (req, res) => {
  try {
    const availableTrains = trainData.filter(train => 
      train.fitnessStatus === 'Valid' && train.jobCardStatus === 'Closed'
    );
    res.json(availableTrains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available trains' });
  }
});

module.exports = router;
