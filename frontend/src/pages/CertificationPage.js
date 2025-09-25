import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Save,
  Shield,
  Award,
  Calendar,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Plus,
  Train as TrainIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CertificationPage = () => {
  const { user } = useAuth();
  
  // State management
  const [certificates, setCertificates] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCert, setEditingCert] = useState(null);
  const [showNewCertForm, setShowNewCertForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load certificates data
  useEffect(() => {
    loadCertificatesData();
  }, []);

  const loadCertificatesData = async () => {
    try {
      setLoading(true);
      
      // Generate comprehensive mock certificates data for 25 trains (100 cars)
      const mockCertificatesData = {
        certificates: generateMockCertificates(),
        inspectors: [
          { inspectorId: "INSP-001", name: "Dr. Rajesh Kumar", designation: "Senior Safety Inspector", certification: "Level-A", experience: "15 years" },
          { inspectorId: "INSP-002", name: "Ms. Priya Sharma", designation: "Safety Inspector", certification: "Level-B", experience: "8 years" },
          { inspectorId: "INSP-003", name: "Mr. Anil Kumar", designation: "Safety Inspector", certification: "Level-B", experience: "12 years" },
          { inspectorId: "INSP-004", name: "Dr. Sunita Nair", designation: "Chief Safety Inspector", certification: "Level-A", experience: "20 years" },
          { inspectorId: "INSP-005", name: "Mr. Vishnu Pillai", designation: "Safety Inspector", certification: "Level-B", experience: "10 years" }
        ]
      };
      
      setCertificates(mockCertificatesData.certificates);
      setInspectors(mockCertificatesData.inspectors);
      setLoading(false);
    } catch (error) {
      console.error('Error loading certificates:', error);
      setLoading(false);
    }
  };

  const generateMockCertificates = () => {
    const certs = [];
    const statuses = ['Valid', 'Expired', 'Expiring Soon'];
    const inspectorNames = ['Dr. Rajesh Kumar', 'Ms. Priya Sharma', 'Mr. Anil Kumar', 'Dr. Sunita Nair', 'Mr. Vishnu Pillai'];
    const inspectorIds = ['INSP-001', 'INSP-002', 'INSP-003', 'INSP-004', 'INSP-005'];
    
    for (let trainNum = 1; trainNum <= 25; trainNum++) {
      const trainId = `KMRL-TS-${trainNum.toString().padStart(2, '0')}`;
      
      // 4 cars per train (2 Motor Cars + 2 Trailer Cars)
      const cars = [
        { type: "Motor Car", position: "Front Motor", carCode: "MC" },
        { type: "Trailer Car", position: "Passenger Car 1", carCode: "TC" },
        { type: "Trailer Car", position: "Passenger Car 2", carCode: "TC" },
        { type: "Motor Car", position: "Rear Motor", carCode: "MC" }
      ];
      
      cars.forEach((car, carIndex) => {
        const carLetter = String.fromCharCode(65 + carIndex);
        const carId = `KMRL-${car.carCode}-${trainNum.toString().padStart(2, '0')}${carLetter}`;
        
        const issueMonth = Math.floor(Math.random() * 6) + 4; // April to September 2024
        const issueDay = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
        const issueDate = `2024-${issueMonth.toString().padStart(2, '0')}-${issueDay}`;
        const expiryDate = `2025-${issueMonth.toString().padStart(2, '0')}-${issueDay}`;
        
        let status;
        if (issueMonth <= 5) {
          status = trainNum % 3 === 0 ? "Expired" : "Expiring Soon";
        } else if (issueMonth === 6) {
          status = trainNum % 4 === 0 ? "Expired" : "Valid";
        } else {
          status = "Valid";
        }
        
        const inspectorIndex = trainNum % inspectorNames.length;
        
        certs.push({
          id: `CERT-${((trainNum - 1) * 4 + carIndex + 1).toString().padStart(3, '0')}`,
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
            inspector: inspectorNames[inspectorIndex],
            inspectorId: inspectorIds[inspectorIndex],
            nextInspectionDue: `${issueMonth <= 6 ? '2024' : '2025'}-${((issueMonth + 6) % 12 + 1).toString().padStart(2, '0')}-${issueDay}`,
            lastInspectionScore: Math.floor(Math.random() * 25) + 75
          }
        });
      });
    }
    
    return certs;
  };

  // Filter and search functionality
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = searchTerm === '' || 
      cert.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.carId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.inspectionDetails.inspector.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTrain = selectedTrain === 'all' || cert.trainId === selectedTrain;
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
    
    return matchesSearch && matchesTrain && matchesStatus;
  });

  // Get unique train IDs for filter dropdown
  const uniqueTrains = [...new Set(certificates.map(cert => cert.trainId))].sort();

  // Statistics
  const stats = {
    total: certificates.length,
    valid: certificates.filter(c => c.status === 'Valid').length,
    expiring: certificates.filter(c => c.status === 'Expiring Soon').length,
    expired: certificates.filter(c => c.status === 'Expired').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Valid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Expiring Soon':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSaveCertificate = (certData) => {
    if (editingCert) {
      setCertificates(certs => certs.map(cert => 
        cert.id === editingCert.id ? { ...cert, ...certData } : cert
      ));
    } else {
      const newCert = {
        id: `CERT-${(certificates.length + 1).toString().padStart(3, '0')}`,
        ...certData
      };
      setCertificates(certs => [...certs, newCert]);
    }
    setEditingCert(null);
    setShowNewCertForm(false);
    setLastUpdate(new Date());
  };

  const handleRefresh = () => {
    loadCertificatesData();
    setLastUpdate(new Date());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Fitness Certificate Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            KMRL Fleet Certification System - 100 Cars across 25 Trains
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              <User className="w-4 h-4" />
              <span>Certification Officer: {user?.username}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowNewCertForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Certificate</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Certificates</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
            <FileCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valid</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.valid}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.expiring}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expired}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by train ID, car ID, or inspector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Train Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedTrain}
              onChange={(e) => setSelectedTrain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Trains</option>
              {uniqueTrains.map(trainId => (
                <option key={trainId} value={trainId}>{trainId}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="Valid">Valid</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Certificates ({filteredCertificates.length} of {certificates.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Certificate ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Train & Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Car Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Inspector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {cert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{cert.trainId}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{cert.carId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{cert.carType}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{cert.position}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(cert.status)}`}>
                      {getStatusIcon(cert.status)}
                      <span>{cert.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(cert.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {cert.inspectionDetails.inspector}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${cert.inspectionDetails.lastInspectionScore >= 90 ? 'text-green-600' : cert.inspectionDetails.lastInspectionScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {cert.inspectionDetails.lastInspectionScore}/100
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit Certificate"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Download Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certificates found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              KMRL Safety Compliance System
            </span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
          <strong>Fleet Overview:</strong> 25 Metro Trains • 100 Cars (50 Motor Cars + 50 Trailer Cars) • 
          {stats.valid} Valid • {stats.expiring} Expiring Soon • {stats.expired} Expired
        </div>
      </div>
    </div>
  );
};

export default CertificationPage;