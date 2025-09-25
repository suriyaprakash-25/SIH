@echo off
echo ========================================
echo    Metro Induction Planner Launcher
echo ========================================
echo.

REM Kill any existing processes to prevent conflicts
echo [0/4] Cleaning up existing processes...
taskkill /im node.exe /F >nul 2>&1
echo ✅ Cleaned up existing Node.js processes

echo.
echo [1/4] Starting Backend Server...
start "MIP Backend" cmd /k "cd /d %~dp0backend && echo Starting Metro Induction Planner Backend... && npm run dev"

echo [2/4] Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo [3/4] Starting Frontend Server...
start "MIP Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Metro Induction Planner Frontend... && npm start"

echo [4/4] Opening application in browser...
timeout /t 8 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo ✅ Metro Induction Planner Started!
echo ========================================
echo 🖥️  Backend API: http://localhost:5000
echo 🌐 Frontend App: http://localhost:3000
echo.
echo ⚠️  Keep both terminal windows open!
echo ❌ To stop: Close both terminal windows
echo.
echo Press any key to exit this launcher...
pause > nul