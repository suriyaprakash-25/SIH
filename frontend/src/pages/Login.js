import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    role: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Demo credentials (hidden from UI)
  const validCredentials = {
    'Admin': { username: 'admin2024', password: 'KMRL@admin#2024' },
    'Engineering Officer': { username: 'engine.tech', password: 'Engine#Health@123' },
    'Safety Officer': { username: 'safety.first', password: 'Safety&Secure@456' },
    'Certification Officer': { username: 'cert.officer', password: 'CertValid@789' },
    'Maintenance Officer': { username: 'maint.pro', password: 'Maintain#Power@321' },
    'Operations Officer': { username: 'ops.manager', password: 'Operations@654' },
    'Driver/Pilot': { username: 'pilot.drive', password: 'SafeDrive@987' }
  };

  const roleRoutes = {
    'Admin': '/admin-dashboard',
    'Engineering Officer': '/engineering-dashboard',
    'Safety Officer': '/safety-dashboard',
    'Certification Officer': '/certification-dashboard',
    'Maintenance Officer': '/maintenance-dashboard',
    'Operations Officer': '/operations-dashboard',
    'Driver/Pilot': '/driver-dashboard'
  };

  const handleRoleSelect = (role) => {
    setCredentials({ ...credentials, role, username: '', password: '' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validCredentials[credentials.role];
    
    if (valid && credentials.username === valid.username && credentials.password === valid.password) {
      navigate(roleRoutes[credentials.role]);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const roles = [
    { name: 'Admin', icon: '👨‍💼', color: 'from-purple-600 to-blue-600', desc: 'System Administration' },
    { name: 'Engineering Officer', icon: '⚙️', color: 'from-blue-600 to-cyan-600', desc: 'Technical Operations' },
    { name: 'Safety Officer', icon: '🛡️', color: 'from-green-600 to-teal-600', desc: 'Safety Management' },
    { name: 'Certification Officer', icon: '📋', color: 'from-orange-600 to-red-600', desc: 'Certificate Management' },
    { name: 'Maintenance Officer', icon: '🔧', color: 'from-yellow-600 to-orange-600', desc: 'Equipment Maintenance' },
    { name: 'Operations Officer', icon: '📊', color: 'from-indigo-600 to-purple-600', desc: 'Operations Control' },
    { name: 'Driver/Pilot', icon: '🚊', color: 'from-emerald-600 to-green-600', desc: 'Train Operations' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center pt-8 pb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">
            KMRL Metro System
          </h1>
          <p className="text-xl text-blue-100 font-light">
            Kochi Metro Rail Limited - Staff Portal
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Role Selection or Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          {!credentials.role ? (
            <div className="max-w-6xl w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Select Your Role</h2>
                <p className="text-blue-100 text-lg">Choose your department to access the appropriate dashboard</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.name}
                    onClick={() => handleRoleSelect(role.name)}
                    className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-white/30"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="text-4xl mb-4">{role.icon}</div>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-100 transition-colors">
                        {role.name}
                      </h3>
                      <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors">
                        {role.desc}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-md w-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">
                    Logging in as <span className="font-semibold text-blue-600">{credentials.role}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Sign In
                  </button>
                </form>

                <button
                  onClick={() => setCredentials({ role: '', username: '', password: '' })}
                  className="mt-6 w-full text-gray-600 text-sm hover:text-gray-800 transition-colors"
                >
                  ← Back to role selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-blue-200 text-sm">
            © 2024 Kochi Metro Rail Limited. All rights reserved.
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;