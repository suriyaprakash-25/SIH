import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    role: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Demo credentials (Simple format)
  const validCredentials = {
    'Admin': { email: 'admin@kmrl.com', password: 'admin123' },
    'Fitness Certificates': { email: 'fitness@kmrl.com', password: 'fitness123' },
    'Job Card Status': { email: 'jobcard@kmrl.com', password: 'jobcard123' },
    'Branding Priorities': { email: 'branding@kmrl.com', password: 'branding123' },
    'Communication Management': { email: 'communication@kmrl.com', password: 'communication123' },
    'Cleaning & Maintenance': { email: 'maintenance@kmrl.com', password: 'maintenance123' }
  };

  const roleRoutes = {
    'Admin': '/dashboard',
    'Fitness Certificates': '/certification',
    'Job Card Status': '/job-card',
    'Branding Priorities': '/branding',
    'Communication Management': '/cleaning',
    'Cleaning & Maintenance': '/maintenance'
  };

  const handleRoleSelect = (role) => {
    setCredentials({ ...credentials, role, username: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Handle both email and username formats
      let email = credentials.username;
      
      // If it's not an email, convert username to Firebase email format
      if (!email.includes('@')) {
        email = `${credentials.username}@kmrl.com`;
      }
      
      // Use Firebase authentication
      const result = await login({
        username: credentials.username,
        email: email,
        password: credentials.password,
        role: credentials.role
      });
      
      if (result) {
        // Navigate to role-specific page
        navigate(roleRoutes[credentials.role]);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        setError('User not found. Please check your email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Invalid password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid username format.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { name: 'Admin', icon: '👨‍💼', color: 'from-purple-600 to-blue-600', desc: 'System Administration & Analytics' },
    { name: 'Fitness Certificates', icon: '📋', color: 'from-green-600 to-emerald-600', desc: 'Train Fitness Certification' },
    { name: 'Job Card Status', icon: '🔧', color: 'from-blue-600 to-cyan-600', desc: 'Maintenance Job Tracking' },
    { name: 'Branding Priorities', icon: '🎨', color: 'from-pink-600 to-rose-600', desc: 'Advertisement & Branding' },
    { name: 'Communication Management', icon: '📡', color: 'from-teal-600 to-cyan-600', desc: 'Signalling & Telecom Systems' },
    { name: 'Cleaning & Maintenance', icon: '🧹', color: 'from-yellow-600 to-orange-600', desc: 'Comprehensive Cleaning Operations' }
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
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email (e.g., admin2024@kmrl.com)"
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
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
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