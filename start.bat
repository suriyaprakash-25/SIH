@echo off
echo Starting Metro Induction Planner...
echo.

echo [1/3] Starting Backend Server...
start "MIP Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo [2/3] Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend Server...
start "MIP Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Metro Induction Planner is starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)
pause > nul
