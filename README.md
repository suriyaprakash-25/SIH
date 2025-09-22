# Metro Induction Planner (MIP) 🚊

A comprehensive web-based decision-support system for **Kochi Metro Rail Limited (KMRL)** that automates train induction planning, reducing manual planning time from 2+ hours to under 5 minutes.

## 🎯 Project Overview

The Metro Induction Planner is an AI-powered system that helps metro supervisors decide which trains should be allocated for:
- **Service** (passenger operations)  
- **Standby** (backup/reserve)
- **Maintenance** (repairs & inspection)

### Key Features

- 📊 **Interactive Dashboard** with real-time KPIs and fleet analytics
- 🤖 **AI-Powered Planning Engine** with rule-based optimization
- 🔍 **What-If Simulation** for scenario testing
- 📱 **Modern UI/UX** with dark/light mode support
- 📄 **Export Capabilities** (PDF/CSV reports)
- ⚡ **Real-time Updates** and conflict alerts

## 🛠 Tech Stack

**Frontend:**
- React 18 + React Router
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- jsPDF for report generation

**Backend:**
- Node.js + Express
- RESTful API design
- JSON mock data storage
- CORS enabled
- Morgan logging

**Development:**
- Modern ES6+ JavaScript
- Modular component architecture
- Responsive design principles
- Production-ready code structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd metro-induction-planner
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

5. **Start the Frontend Development Server**
   ```bash
   cd ../frontend
   npm start
   # Application runs on http://localhost:3000
   ```

### Production Build

```bash
# Frontend build
cd frontend
npm run build

# Backend production
cd ../backend
npm start
```

## 📋 Application Features

### 1. Dashboard
- **Fleet Overview**: Total trains, availability status
- **KPI Monitoring**: Punctuality, branding exposure, mileage
- **Visual Analytics**: Charts for train allocation and performance trends
- **Alert System**: Real-time notifications for critical issues

### 2. Train Induction Planning
- **Automated Plan Generation**: AI-driven train allocation
- **Smart Filtering**: Filter by fitness status, job-cards, branding
- **Explainable AI**: Clear reasoning for each decision
- **Export Options**: Download plans as PDF or CSV

### 3. Data Management
- **Multi-tab Interface**: Fitness certificates, job-cards, branding, mileage
- **CRUD Operations**: Add, edit, delete train records
- **Data Import**: CSV upload capability
- **Real-time Validation**: Input validation and error handling

### 4. Simulation & What-If Analysis
- **Scenario Testing**: Test different operational constraints
- **Impact Analysis**: Visual comparison of plan changes
- **Quick Scenarios**: Pre-defined common situations
- **Export Reports**: Detailed comparison documents

## 🧠 Planning Algorithm

The system uses a sophisticated rule-based engine that considers:

### Priority Factors
1. **Safety First**: Fitness certificate validity (highest priority)
2. **Maintenance Status**: Job-card completion status
3. **Branding Strategy**: Premium/Standard/Basic categorization
4. **Mileage Optimization**: Balance wear across fleet
5. **Operational Requirements**: Cleaning status, bay positioning

### Optimization Logic
- **Rule-based Scoring**: Each train gets a priority score (0-100)
- **Multi-criteria Decision**: Weighted scoring across all factors
- **Constraint Satisfaction**: Meets minimum service requirements
- **Flexibility**: Maintains adequate standby capacity

### Sample Decision Logic
```
IF fitness_status = "Expired" THEN assignment = "Maintenance"
ELSE IF priority_score >= 85 AND fitness_valid AND job_closed 
     THEN assignment = "Service"
ELSE IF priority_score >= 60 AND service_slots_available 
     THEN assignment = "Standby"
ELSE assignment = "Maintenance"
```

## 📁 Project Structure

```
metro-induction-planner/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Node.js API server
│   ├── data/               # Mock JSON data
│   ├── routes/             # API route handlers
│   ├── server.js           # Express server setup
│   ├── package.json
│   └── .env
└── README.md
```

## 🎨 User Interface

### Design System
- **Clean & Modern**: Minimalist design with focus on functionality
- **Consistent**: Unified color scheme and typography
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: High contrast ratios and keyboard navigation

### Color Palette
- **Primary Blue**: #0066cc (KMRL brand color)
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Error Red**: #ef4444
- **Neutral Grays**: Various shades for text and backgrounds

### Components
- **Cards**: Soft shadows and rounded corners for data display
- **Tables**: Sortable, filterable data tables
- **Charts**: Interactive visualizations using Recharts
- **Forms**: Clean input fields with validation
- **Buttons**: Consistent styling across all interactions

## 📊 Mock Data Structure

### Train Record
```json
{
  "trainId": "K-101",
  "fitnessStatus": "Valid",
  "jobCardStatus": "Closed", 
  "brandingCategory": "Premium",
  "mileage": 45200,
  "bayPosition": "A1",
  "cleaningStatus": "Completed",
  "lastMaintenance": "2024-08-15",
  "brandingExpiry": "2024-12-31"
}
```

### Induction Plan Output
```json
{
  "service": [/* trains assigned to service */],
  "standby": [/* trains assigned to standby */], 
  "maintenance": [/* trains assigned to maintenance */],
  "all": [
    {
      "trainId": "K-101",
      "assignment": "Service",
      "priorityScore": 95.3,
      "reasoning": "Selected for service due to premium branding priority, valid fitness certificate"
    }
  ]
}
```

## 🔄 API Endpoints

### Trains
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get specific train  
- `PUT /api/trains/:id` - Update train data
- `GET /api/trains/filters/available` - Get available trains

### Planning
- `POST /api/planning/generate` - Generate induction plan
- `POST /api/planning/simulate` - Run what-if simulation
- `GET /api/planning/optimize` - Get optimization suggestions

### Health Check
- `GET /api/health` - API health status

## 🎯 Business Value

### Time Savings
- **Manual Process**: 2+ hours daily
- **Automated Process**: <5 minutes
- **Efficiency Gain**: 96% time reduction

### Operational Benefits
- **Improved Accuracy**: Eliminates human errors in planning
- **Better Utilization**: Optimizes train deployment
- **Enhanced Visibility**: Real-time fleet status monitoring
- **Data-Driven Decisions**: Analytics-backed planning

### Scalability
- **Extensible Architecture**: Easy to add new features
- **Integration Ready**: APIs for external system integration
- **Cloud Deployable**: Ready for production deployment
- **Multi-tenant Capable**: Adaptable for other metro systems

## 🔧 Configuration

### Environment Variables (Backend)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MAX_SERVICE_TRAINS=18
MIN_SERVICE_TRAINS=12
TARGET_STANDBY_TRAINS=4
```

### Build Configuration (Frontend)
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing and optimization
- **React Scripts**: Create React App toolchain

## 🚀 Deployment Options

### Development
- Frontend: `npm start` (localhost:3000)
- Backend: `npm run dev` (localhost:5000)

### Production
- **Frontend**: Static build deployment (Netlify, Vercel, S3)
- **Backend**: Node.js hosting (Railway, Heroku, AWS)
- **Database**: PostgreSQL or MongoDB (for production data)

## 🔮 Future Enhancements

### Short Term
- [ ] **Database Integration**: Replace JSON with PostgreSQL
- [ ] **User Authentication**: Login system with role-based access
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Mobile App**: React Native companion app

### Long Term  
- [ ] **ML Integration**: Machine learning for predictive maintenance
- [ ] **OR-Tools**: Advanced optimization algorithms
- [ ] **IoT Integration**: Real-time train sensor data
- [ ] **Multi-location**: Support for multiple metro networks

## 👥 Development Team

This project was developed for **Kochi Metro Rail Limited (KMRL)** as part of the Smart India Hackathon 2024.

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for KMRL and follows their licensing requirements.

## 📞 Support

For technical support or questions about the Metro Induction Planner:
- **Documentation**: This README and inline code comments
- **API Reference**: Available at `/api/health` endpoint
- **Issues**: GitHub Issues for bug reports and feature requests

---

**Built with ❤️ for Kochi Metro Rail Limited**

*Transforming metro operations through intelligent automation*
