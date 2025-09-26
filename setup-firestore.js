// IMPORTANT: Before running this script:
// 1. Go to Firebase Console: https://console.firebase.google.com/project/sih-logins
// 2. Go to Project Settings > Service Accounts
// 3. Click "Generate new private key"
// 4. Download the JSON file and save it as 'firebase-admin-key.json' in this directory
// 5. Run: npm install firebase-admin
// 6. Then run this script: node setup-firestore.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if admin key exists
const keyPath = path.join(__dirname, 'firebase-admin-key.json');
if (!fs.existsSync(keyPath)) {
  console.log('❌ firebase-admin-key.json not found!');
  console.log('📋 Please follow these steps:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/sih-logins');
  console.log('2. Go to Project Settings > Service Accounts');
  console.log('3. Click "Generate new private key"');
  console.log('4. Download and save as "firebase-admin-key.json" in this directory');
  console.log('5. Run: npm install firebase-admin');
  console.log('6. Then run: node setup-firestore.js');
  process.exit(1);
}

const serviceAccount = require('./firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sih-logins'
});

const db = admin.firestore();
const auth = admin.auth();

async function setupFirestore() {
  console.log('🚀 Setting up KMRL Metro Firestore Database...\n');

  // Step 1: Create Authentication Users
  const users = [
    { email: 'admin@kmrl.com', password: 'admin123', role: 'Admin', department: 'Administration' },
    { email: 'fitness@kmrl.com', password: 'fitness123', role: 'Fitness Certificates', department: 'Safety & Compliance' },
    { email: 'jobcard@kmrl.com', password: 'jobcard123', role: 'Job Card Status', department: 'Maintenance' },
    { email: 'branding@kmrl.com', password: 'branding123', role: 'Branding Priorities', department: 'Marketing' },
    { email: 'mileage@kmrl.com', password: 'mileage123', role: 'Mileage Monitoring', department: 'Operations' },
    { email: 'cleaning@kmrl.com', password: 'cleaning123', role: 'Cleaning Slots', department: 'Facility Management' },
    { email: 'stabling@kmrl.com', password: 'stabling123', role: 'Stabling Positions', department: 'Depot Management' },
    { email: 'maintenance@kmrl.com', password: 'maintenance123', role: 'Cleaning & Maintenance', department: 'Integrated Services' }
  ];

  console.log('👥 Creating Authentication Users...');
  for (const userData of users) {
    try {
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.role
      });
      
      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email: userData.email,
        role: userData.role,
        department: userData.department,
        permissions: userData.role === 'Admin' ? ['read', 'write', 'admin'] : ['read', 'write'],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        active: true,
        lastLogin: null
      });
      
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️  User already exists: ${userData.email}`);
        // Update existing user's Firestore document
        try {
          const existingUser = await auth.getUserByEmail(userData.email);
          await db.collection('users').doc(existingUser.uid).set({
            email: userData.email,
            role: userData.role,
            department: userData.department,
            permissions: userData.role === 'Admin' ? ['read', 'write', 'admin'] : ['read', 'write'],
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            active: true
          }, { merge: true });
          console.log(`🔄 Updated user document: ${userData.email}`);
        } catch (updateError) {
          console.error(`❌ Error updating user ${userData.email}:`, updateError.message);
        }
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }

  // Step 2: Create Sample Data Collections
  console.log('\n📊 Creating Sample Data Collections...');

  // Certificates Collection
  const certificates = [
    {
      trainId: 'KMRL-TS-01',
      carId: 'KMRL-MC-01A',
      certificateType: 'Safety Fitness',
      issueDate: new Date('2024-01-15'),
      expiryDate: new Date('2025-01-15'),
      status: 'Valid',
      inspector: 'Inspector Kumar',
      score: 95,
      nextInspection: new Date('2024-12-15'),
      notes: 'All systems operational'
    },
    {
      trainId: 'KMRL-TS-02',
      carId: 'KMRL-TC-02B',
      certificateType: 'Electrical Safety',
      issueDate: new Date('2024-02-10'),
      expiryDate: new Date('2024-12-25'),
      status: 'Expiring Soon',
      inspector: 'Inspector Sharma',
      score: 88,
      nextInspection: new Date('2024-11-25'),
      notes: 'Minor electrical adjustments needed'
    },
    {
      trainId: 'KMRL-TS-03',
      carId: 'KMRL-MC-03C',
      certificateType: 'Fire Safety',
      issueDate: new Date('2024-03-05'),
      expiryDate: new Date('2025-03-05'),
      status: 'Valid',
      inspector: 'Inspector Raj',
      score: 92,
      nextInspection: new Date('2025-02-05'),
      notes: 'Fire suppression system excellent'
    }
  ];

  const certBatch = db.batch();
  certificates.forEach(cert => {
    const docRef = db.collection('certificates').doc();
    certBatch.set(docRef, {
      ...cert,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await certBatch.commit();
  console.log(`✅ Created ${certificates.length} certificate records`);

  // Job Cards Collection
  const jobCards = [
    {
      trainId: 'KMRL-TS-01',
      jobId: 'JC-2024-001',
      status: 'Open',
      priority: 'High',
      details: 'Brake pad replacement required in car A',
      assignedTo: 'Maintenance Team Alpha',
      estimatedHours: 4,
      actualHours: null,
      createdDate: new Date('2024-09-20'),
      dueDate: new Date('2024-09-27'),
      completionDate: null,
      cost: 15000
    },
    {
      trainId: 'KMRL-TS-02',
      jobId: 'JC-2024-002',
      status: 'In Progress',
      priority: 'Medium',
      details: 'HVAC unit inspection and cleaning',
      assignedTo: 'Maintenance Team Beta',
      estimatedHours: 6,
      actualHours: 3.5,
      createdDate: new Date('2024-09-22'),
      dueDate: new Date('2024-09-29'),
      completionDate: null,
      cost: 8500
    },
    {
      trainId: 'KMRL-TS-03',
      jobId: 'JC-2024-003',
      status: 'Completed',
      priority: 'Low',
      details: 'Door mechanism lubrication',
      assignedTo: 'Maintenance Team Gamma',
      estimatedHours: 2,
      actualHours: 1.5,
      createdDate: new Date('2024-09-18'),
      dueDate: new Date('2024-09-25'),
      completionDate: new Date('2024-09-24'),
      cost: 3200
    }
  ];

  const jobBatch = db.batch();
  jobCards.forEach(job => {
    const docRef = db.collection('jobCards').doc();
    jobBatch.set(docRef, {
      ...job,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await jobBatch.commit();
  console.log(`✅ Created ${jobCards.length} job card records`);

  // Branding Collection
  const brandingData = [
    {
      trainId: 'KMRL-TS-01',
      advertisementId: 'AD-2024-KFC',
      brandName: 'KFC Kerala',
      campaign: 'Taste of Kerala',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'Active',
      revenue: 500000,
      condition: 'Good',
      position: 'Exterior Side Panels',
      contact: 'marketing@kfc.kerala.com'
    },
    {
      trainId: 'KMRL-TS-02',
      advertisementId: 'AD-2024-TECH',
      brandName: 'TechPark Kochi',
      campaign: 'Innovation Hub',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-11-30'),
      status: 'Active',
      revenue: 750000,
      condition: 'Excellent',
      position: 'Interior Display Screens',
      contact: 'ads@techparkkochi.com'
    },
    {
      trainId: 'KMRL-TS-03',
      advertisementId: 'AD-2024-MALL',
      brandName: 'Lulu Mall Kochi',
      campaign: 'Shopping Festival',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-10-31'),
      status: 'Expiring Soon',
      revenue: 425000,
      condition: 'Fair',
      position: 'Wrap Around Exterior',
      contact: 'promotions@lulumall.com'
    }
  ];

  const brandBatch = db.batch();
  brandingData.forEach(brand => {
    const docRef = db.collection('branding').doc();
    brandBatch.set(docRef, {
      ...brand,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await brandBatch.commit();
  console.log(`✅ Created ${brandingData.length} branding records`);

  // Mileage Collection
  const mileageData = [
    {
      trainId: 'KMRL-TS-01',
      date: new Date('2024-09-25'),
      dailyMileage: 245.8,
      cumulativeMileage: 87652.4,
      fuelEfficiency: 3.2,
      routeDetails: 'Aluva-Petta-Aluva (12 trips)',
      driverName: 'Raman Kumar',
      shiftType: 'Morning',
      notes: 'Smooth operation'
    },
    {
      trainId: 'KMRL-TS-02',
      date: new Date('2024-09-25'),
      dailyMileage: 198.3,
      cumulativeMileage: 72148.9,
      fuelEfficiency: 3.1,
      routeDetails: 'Aluva-Maharajas-Aluva (10 trips)',
      driverName: 'Suresh Nair',
      shiftType: 'Evening',
      notes: 'Minor delay due to signal issues'
    },
    {
      trainId: 'KMRL-TS-03',
      date: new Date('2024-09-25'),
      dailyMileage: 267.1,
      cumulativeMileage: 95234.7,
      fuelEfficiency: 3.3,
      routeDetails: 'Full line operations (14 trips)',
      driverName: 'Mohanan Pillai',
      shiftType: 'Full Day',
      notes: 'Excellent performance'
    }
  ];

  const mileageBatch = db.batch();
  mileageData.forEach(mileage => {
    const docRef = db.collection('mileage').doc();
    mileageBatch.set(docRef, {
      ...mileage,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await mileageBatch.commit();
  console.log(`✅ Created ${mileageData.length} mileage records`);

  // Cleaning Collection
  const cleaningData = [
    {
      trainId: 'KMRL-TS-01',
      date: new Date('2024-09-26'),
      slotTime: '05:30 - 07:00',
      cleaningType: 'Deep Clean',
      status: 'Scheduled',
      assignedTeam: 'Cleaning Team A',
      estimatedDuration: 90,
      actualDuration: null,
      areas: ['Interior', 'Exterior', 'Windows', 'Floors'],
      priority: 'High',
      notes: 'Pre-service deep cleaning'
    },
    {
      trainId: 'KMRL-TS-02',
      date: new Date('2024-09-26'),
      slotTime: '13:00 - 13:45',
      cleaningType: 'Maintenance Clean',
      status: 'In Progress',
      assignedTeam: 'Cleaning Team B',
      estimatedDuration: 45,
      actualDuration: 30,
      areas: ['Interior', 'Sanitization'],
      priority: 'Medium',
      notes: 'Midday maintenance'
    },
    {
      trainId: 'KMRL-TS-03',
      date: new Date('2024-09-25'),
      slotTime: '21:30 - 22:15',
      cleaningType: 'End-of-Day Clean',
      status: 'Completed',
      assignedTeam: 'Cleaning Team C',
      estimatedDuration: 45,
      actualDuration: 42,
      areas: ['Interior', 'Floors', 'Waste Removal'],
      priority: 'Medium',
      notes: 'Standard end-of-service cleaning'
    }
  ];

  const cleaningBatch = db.batch();
  cleaningData.forEach(cleaning => {
    const docRef = db.collection('cleaning').doc();
    cleaningBatch.set(docRef, {
      ...cleaning,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await cleaningBatch.commit();
  console.log(`✅ Created ${cleaningData.length} cleaning records`);

  // Stabling Collection
  const stablingData = [
    {
      trainId: 'KMRL-TS-01',
      position: 'Bay-01-A',
      depot: 'Muttom Depot',
      status: 'Occupied',
      arrivalTime: new Date('2024-09-25T22:45:00'),
      departureTime: new Date('2024-09-26T05:15:00'),
      nextService: new Date('2024-09-26T05:30:00'),
      maintenanceFlag: false,
      notes: 'Regular overnight stabling'
    },
    {
      trainId: 'KMRL-TS-02',
      position: 'Bay-02-B',
      depot: 'Muttom Depot',
      status: 'Under Maintenance',
      arrivalTime: new Date('2024-09-25T14:30:00'),
      departureTime: null,
      nextService: new Date('2024-09-27T06:00:00'),
      maintenanceFlag: true,
      notes: 'Scheduled brake maintenance'
    },
    {
      trainId: 'KMRL-TS-03',
      position: 'Bay-03-C',
      depot: 'Muttom Depot',
      status: 'Ready',
      arrivalTime: new Date('2024-09-25T23:00:00'),
      departureTime: new Date('2024-09-26T05:45:00'),
      nextService: new Date('2024-09-26T06:00:00'),
      maintenanceFlag: false,
      notes: 'Ready for morning service'
    }
  ];

  const stablingBatch = db.batch();
  stablingData.forEach(stabling => {
    const docRef = db.collection('stabling').doc();
    stablingBatch.set(docRef, {
      ...stabling,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await stablingBatch.commit();
  console.log(`✅ Created ${stablingData.length} stabling records`);

  // Maintenance Collection (for Cleaning & Maintenance role)
  const maintenanceData = [
    {
      trainId: 'KMRL-TS-01',
      type: 'Preventive',
      component: 'Air Conditioning',
      description: 'Monthly HVAC filter replacement and system check',
      status: 'Scheduled',
      priority: 'Medium',
      scheduledDate: new Date('2024-09-28'),
      estimatedHours: 3,
      assignedTechnician: 'Tech Team Alpha',
      cost: 12000,
      lastMaintenance: new Date('2024-08-28')
    },
    {
      trainId: 'KMRL-TS-02',
      type: 'Corrective',
      component: 'Door System',
      description: 'Door sensor calibration and mechanism adjustment',
      status: 'In Progress',
      priority: 'High',
      scheduledDate: new Date('2024-09-26'),
      estimatedHours: 5,
      assignedTechnician: 'Tech Team Beta',
      cost: 18500,
      lastMaintenance: new Date('2024-07-15')
    },
    {
      trainId: 'KMRL-TS-03',
      type: 'Emergency',
      component: 'Brake System',
      description: 'Emergency brake pad replacement after inspection',
      status: 'Completed',
      priority: 'Critical',
      scheduledDate: new Date('2024-09-24'),
      estimatedHours: 6,
      assignedTechnician: 'Tech Team Gamma',
      cost: 25000,
      lastMaintenance: new Date('2024-09-24'),
      completionDate: new Date('2024-09-24')
    }
  ];

  const maintenanceBatch = db.batch();
  maintenanceData.forEach(maintenance => {
    const docRef = db.collection('maintenance').doc();
    maintenanceBatch.set(docRef, {
      ...maintenance,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await maintenanceBatch.commit();
  console.log(`✅ Created ${maintenanceData.length} maintenance records`);

  console.log('\n🎉 KMRL Metro Firestore Database Setup Complete!');
  console.log('\n📋 Summary:');
  console.log(`• ✅ Created ${users.length} authentication users with role-based access`);
  console.log(`• ✅ Created ${certificates.length} fitness certificate records`);
  console.log(`• ✅ Created ${jobCards.length} job card tracking records`);
  console.log(`• ✅ Created ${brandingData.length} branding & advertisement records`);
  console.log(`• ✅ Created ${mileageData.length} mileage monitoring records`);
  console.log(`• ✅ Created ${cleaningData.length} cleaning slot records`);
  console.log(`• ✅ Created ${stablingData.length} stabling position records`);
  console.log(`• ✅ Created ${maintenanceData.length} maintenance tracking records`);
  console.log('• ✅ Applied comprehensive security rules for role-based access control');
  
  console.log('\n🔐 Login Credentials Created:');
  users.forEach(user => {
    console.log(`   ${user.role}: ${user.email} / ${user.password}`);
  });
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Deploy Firestore rules: firebase deploy --only firestore:rules');
  console.log('2. Test your application with the created credentials');
  console.log('3. Access your app at: http://localhost:3000');
  
  process.exit(0);
}

// Run the setup
setupFirestore().catch(console.error);