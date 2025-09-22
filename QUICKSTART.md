# Metro Induction Planner - Quick Start Guide

## 🚀 Getting Started

### Option 1: Using Windows Batch Script (Recommended)
Simply double-click `start.bat` in the project root. This will:
1. Start the backend server on http://localhost:5000
2. Start the frontend server on http://localhost:3000
3. Automatically open the application in your browser

### Option 2: Manual Start
Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 3: Using VS Code Tasks
1. Open the project in VS Code
2. Press `Ctrl+Shift+P` and type "Tasks: Run Task"
3. Select "Start Full Application"

## 📱 Using the Application

### Dashboard
- View real-time KPIs and fleet statistics
- Monitor train allocation charts
- Check recent alerts and notifications

### Train Planning
1. Click "Train Induction Planning" in the sidebar
2. Use filters to refine the train list
3. Click "Generate Induction Plan" to create optimized assignments
4. Export results as PDF or CSV

### Data Management
- Navigate to "Data Inputs" to manage train information
- Add/edit fitness certificates, job cards, and branding data
- Import data via CSV upload

### Simulation
- Go to "Simulation & What-If" to test scenarios
- Use quick scenarios or create custom constraints
- Compare original vs. simulated plans

## 🔧 Troubleshooting

### Backend Issues
- Ensure port 5000 is available
- Check the backend terminal for error messages
- API health check: http://localhost:5000/api/health

### Frontend Issues
- Ensure port 3000 is available
- Clear browser cache and reload
- Check console for JavaScript errors

### Common Solutions
- Restart both servers
- Delete `node_modules` and run `npm install` again
- Check firewall/antivirus settings

## 📊 Features Overview

### ✅ Implemented Features
- [x] Interactive Dashboard with KPIs
- [x] AI-powered Train Induction Planning
- [x] Data Input Management
- [x] What-If Simulation
- [x] Export (PDF/CSV)
- [x] Dark/Light Mode
- [x] Responsive Design
- [x] Mock Data Integration

### 🔄 In Development
- [ ] Real-time Data Integration
- [ ] User Authentication
- [ ] Database Integration
- [ ] Advanced Analytics

## 🌐 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/trains` - Get all trains
- `POST /api/planning/generate` - Generate induction plan
- `POST /api/planning/simulate` - Run simulation

## 📧 Support

For issues or questions:
1. Check this README
2. Review console logs
3. Restart the application
4. Contact the development team

---
**Metro Induction Planner v1.0** - Built for Kochi Metro Rail Limited
