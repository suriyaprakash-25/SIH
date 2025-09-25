// Test script for 6-factor train availability monitoring system
const { getUnifiedFleetData } = require('./backend/dataService');

console.log('🧪 Testing 6-Factor Train Availability System');
console.log('===============================================');

try {
  const fleetData = getUnifiedFleetData();
  
  console.log(`\n📊 Loaded ${fleetData.length} trains with enhanced factor monitoring`);
  
  // Test first train's availability factors
  if (fleetData.length > 0) {
    const train = fleetData[0];
    console.log(`\n🚊 Sample Train: ${train.trainId}`);
    console.log('📋 6-Factor Availability Breakdown:');
    
    if (train.availabilityFactors) {
      Object.entries(train.availabilityFactors).forEach(([factor, data]) => {
        const status = data.status;
        const emoji = status === 'good' ? '✅' : status === 'warning' ? '⚠️' : '❌';
        console.log(`   ${emoji} ${factor.toUpperCase()}: ${status} - ${data.details}`);
      });
      
      console.log(`\n🎯 Overall Service Availability: ${train.isAvailableForService ? '✅ AVAILABLE' : '❌ NOT AVAILABLE'}`);
      console.log(`📈 Train Score: ${train.score}/100`);
    } else {
      console.log('❌ Availability factors not found - check backend implementation');
    }
  }
  
  // Count availability by status
  console.log('\n📈 Fleet Availability Summary:');
  const available = fleetData.filter(t => t.isAvailableForService).length;
  const unavailable = fleetData.length - available;
  
  console.log(`✅ Available for Service: ${available} trains`);
  console.log(`❌ Not Available: ${unavailable} trains`);
  
  // Factor-wise analysis
  console.log('\n🔍 Factor-wise Fleet Analysis:');
  const factors = ['engine', 'cleaning', 'certificates', 'branding', 'maintenance', 'serviceInterval'];
  
  factors.forEach(factor => {
    const good = fleetData.filter(t => t.availabilityFactors?.[factor]?.status === 'good').length;
    const warning = fleetData.filter(t => t.availabilityFactors?.[factor]?.status === 'warning').length;
    const critical = fleetData.filter(t => t.availabilityFactors?.[factor]?.status === 'critical').length;
    
    console.log(`📊 ${factor.toUpperCase()}: Good(${good}) Warning(${warning}) Critical(${critical})`);
  });
  
  console.log('\n🎉 6-Factor monitoring system test completed successfully!');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}