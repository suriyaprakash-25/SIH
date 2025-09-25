// Test script to verify the multi-source data ingestion system
const { getUnifiedFleetData, getFleetStatistics } = require('./backend/dataService');

console.log('🧪 Testing Multi-Source Data Ingestion System');
console.log('================================================');

try {
  // Test data loading
  console.log('\n📊 Loading fleet data...');
  const fleetData = getUnifiedFleetData();
  
  console.log(`✅ Successfully loaded ${fleetData.length} trains`);
  
  // Display sample data
  console.log('\n📋 Sample train data:');
  if (fleetData.length > 0) {
    const sample = fleetData[0];
    console.log(JSON.stringify(sample, null, 2));
  }
  
  // Test statistics
  console.log('\n📈 Fleet statistics:');
  const stats = getFleetStatistics();
  console.log(JSON.stringify(stats, null, 2));
  
  // Verify data structure
  console.log('\n🔍 Data structure verification:');
  console.log('All trains have required fields:');
  
  const requiredFields = ['id', 'trainId', 'mileage', 'bayPosition', 'fitnessStatus', 'jobCard', 'branding'];
  let allValid = true;
  
  fleetData.forEach((train, index) => {
    const missing = requiredFields.filter(field => !train[field]);
    if (missing.length > 0) {
      console.log(`❌ Train ${train.trainId || index}: Missing fields: ${missing.join(', ')}`);
      allValid = false;
    }
  });
  
  if (allValid) {
    console.log('✅ All trains have required fields');
  }
  
  // Test data sources
  console.log('\n🔗 Data source verification:');
  const certCount = fleetData.filter(t => t.fitnessCertificate.status === 'Active').length;
  const jobCardCount = fleetData.filter(t => t.jobCard.status === 'Open').length;
  const brandedCount = fleetData.filter(t => t.branding.category === 'Branded').length;
  
  console.log(`- Active certificates: ${certCount}`);
  console.log(`- Open job cards: ${jobCardCount}`);
  console.log(`- Branded trains: ${brandedCount}`);
  
  console.log('\n🎉 Multi-source data ingestion test completed successfully!');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}