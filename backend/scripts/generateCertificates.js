const fs = require('fs');

// Generate certificates for all 25 trains (100 cars total)
const generateCertificates = () => {
  const certificates = [];
  const inspectors = [
    { id: "INSP-001", name: "Dr. Rajesh Kumar" },
    { id: "INSP-002", name: "Ms. Priya Sharma" },
    { id: "INSP-003", name: "Mr. Anil Kumar" },
    { id: "INSP-004", name: "Dr. Sunita Nair" },
    { id: "INSP-005", name: "Mr. Vishnu Pillai" }
  ];
  
  const statuses = ["Valid", "Expired", "Expiring Soon"];
  
  let certId = 1;
  
  for (let trainNum = 1; trainNum <= 25; trainNum++) {
    const trainId = `KMRL-TS-${trainNum.toString().padStart(2, '0')}`;
    
    // Generate 4 cars per train (2 Motor Cars + 2 Trailer Cars)
    const cars = [
      { type: "Motor Car", position: "Front Motor", carCode: "MC" },
      { type: "Trailer Car", position: "Passenger Car 1", carCode: "TC" },
      { type: "Trailer Car", position: "Passenger Car 2", carCode: "TC" },
      { type: "Motor Car", position: "Rear Motor", carCode: "MC" }
    ];
    
    cars.forEach((car, carIndex) => {
      const carLetter = String.fromCharCode(65 + carIndex); // A, B, C, D
      const carId = `KMRL-${car.carCode}-${trainNum.toString().padStart(2, '0')}${carLetter}`;
      
      // Randomize dates and statuses
      const issueMonths = [4, 5, 6, 7, 8, 9];
      const issueDays = [10, 15, 20, 25];
      const randomIssueMonth = issueMonths[Math.floor(Math.random() * issueMonths.length)];
      const randomIssueDay = issueDays[Math.floor(Math.random() * issueDays.length)];
      
      const issueDate = `2024-${randomIssueMonth.toString().padStart(2, '0')}-${randomIssueDay}`;
      const expiryDate = `2025-${randomIssueMonth.toString().padStart(2, '0')}-${randomIssueDay}`;
      
      // Determine status based on issue date
      let status;
      if (randomIssueMonth <= 5) {
        status = trainNum % 3 === 0 ? "Expired" : "Expiring Soon";
      } else if (randomIssueMonth === 6) {
        status = trainNum % 4 === 0 ? "Expired" : "Valid";
      } else {
        status = "Valid";
      }
      
      const inspector = inspectors[trainNum % inspectors.length];
      const score = Math.floor(Math.random() * 25) + 75; // 75-99
      
      const certificate = {
        id: `CERT-${certId.toString().padStart(3, '0')}`,
        trainId,
        carId,
        carType: car.type,
        position: car.position,
        certificateType: "Fitness Certificate",
        issueDate,
        expiryDate,
        issuedBy: "KMRL Safety Department",
        status,
        inspectionDetails: {
          inspector: inspector.name,
          inspectorId: inspector.id,
          nextInspectionDue: `${randomIssueMonth <= 6 ? '2024' : '2025'}-${(randomIssueMonth + 6).toString().padStart(2, '0')}-${randomIssueDay}`,
          lastInspectionScore: score
        }
      };
      
      certificates.push(certificate);
      certId++;
    });
  }
  
  return certificates;
};

const inspectorDetails = [
  {
    inspectorId: "INSP-001",
    name: "Dr. Rajesh Kumar",
    designation: "Senior Safety Inspector",
    certification: "Level-A Safety Inspector",
    experience: "15 years",
    contactEmail: "rajesh.kumar@kmrl.in"
  },
  {
    inspectorId: "INSP-002",
    name: "Ms. Priya Sharma",
    designation: "Safety Inspector",
    certification: "Level-B Safety Inspector",
    experience: "8 years",
    contactEmail: "priya.sharma@kmrl.in"
  },
  {
    inspectorId: "INSP-003",
    name: "Mr. Anil Kumar",
    designation: "Safety Inspector",
    certification: "Level-B Safety Inspector",
    experience: "12 years",
    contactEmail: "anil.kumar@kmrl.in"
  },
  {
    inspectorId: "INSP-004",
    name: "Dr. Sunita Nair",
    designation: "Chief Safety Inspector",
    certification: "Level-A Safety Inspector",
    experience: "20 years",
    contactEmail: "sunita.nair@kmrl.in"
  },
  {
    inspectorId: "INSP-005",
    name: "Mr. Vishnu Pillai",
    designation: "Safety Inspector",
    certification: "Level-B Safety Inspector",
    experience: "10 years",
    contactEmail: "vishnu.pillai@kmrl.in"
  },
  {
    inspectorId: "INSP-006",
    name: "Ms. Deepa Menon",
    designation: "Junior Safety Inspector",
    certification: "Level-C Safety Inspector",
    experience: "5 years",
    contactEmail: "deepa.menon@kmrl.in"
  },
  {
    inspectorId: "INSP-007",
    name: "Mr. Ravi Varma",
    designation: "Safety Inspector",
    certification: "Level-B Safety Inspector",
    experience: "9 years",
    contactEmail: "ravi.varma@kmrl.in"
  }
];

// Generate all certificates
const allCertificates = generateCertificates();

const finalData = {
  certificates: allCertificates,
  inspectors: inspectorDetails,
  metadata: {
    totalTrains: 25,
    totalCars: 100,
    totalCertificates: allCertificates.length,
    lastUpdated: new Date().toISOString(),
    validCertificates: allCertificates.filter(c => c.status === "Valid").length,
    expiredCertificates: allCertificates.filter(c => c.status === "Expired").length,
    expiringSoonCertificates: allCertificates.filter(c => c.status === "Expiring Soon").length
  }
};

// Write to file
fs.writeFileSync('./certificates.json', JSON.stringify(finalData, null, 2));
console.log(`Generated ${allCertificates.length} certificates for 25 trains (100 cars)`);
console.log(`Valid: ${finalData.metadata.validCertificates}`);
console.log(`Expired: ${finalData.metadata.expiredCertificates}`);
console.log(`Expiring Soon: ${finalData.metadata.expiringSoonCertificates}`);