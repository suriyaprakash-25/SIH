import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role mappings for Firebase auth
const ROLE_MAPPINGS = {
  'admin@kmrl.com': 'Admin',
  'fitness@kmrl.com': 'Fitness Certificates',
  'jobcard@kmrl.com': 'Job Card Status',
  'branding@kmrl.com': 'Branding Priorities',
  'communication@kmrl.com': 'Communication Management',
  'maintenance@kmrl.com': 'Cleaning & Maintenance'
};

const ROUTE_MAPPINGS = {
  'Admin': '/dashboard',
  'Fitness Certificates': '/certification',
  'Job Card Status': '/job-card',
  'Branding Priorities': '/branding',
  'Communication Management': '/cleaning',
  'Cleaning & Maintenance': '/maintenance'
};

// Legacy username to email mapping for backward compatibility
const USERNAME_TO_EMAIL = {
  'admin': 'admin@kmrl.com',
  'fitness': 'fitness@kmrl.com',
  'jobcard': 'jobcard@kmrl.com',
  'branding': 'branding@kmrl.com',
  'communication': 'communication@kmrl.com',
  'maintenance': 'maintenance@kmrl.com'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase sign in with email and password
  const signInFirebase = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from email mapping
      const role = ROLE_MAPPINGS[user.email];
      setUserRole(role);
      
      return { user, role, route: ROUTE_MAPPINGS[role] };
    } catch (error) {
      console.error('Firebase sign in error:', error);
      throw error;
    }
  };

  // Firebase authentication method (primary)
  const login = async (credentials) => {
    try {
      // Use Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      
      // Get role from email mapping
      const role = ROLE_MAPPINGS[user.email] || credentials.role;
      
      // Set state
      setCurrentUser(user);
      setUserRole(role);
      
      // Create user data object
      const userData = {
        username: credentials.username,
        role: role,
        email: user.email,
        uid: user.uid,
        authenticated: true,
        firebaseUser: user,
        loginTime: new Date().toISOString()
      };
      
      return userData;
    } catch (error) {
      console.error('Firebase login error:', error);
      throw error;
    }
  };

  // Firebase login method (for future use)
  const loginWithFirebase = async (credentials) => {
    try {
      // Convert username to email format
      const email = USERNAME_TO_EMAIL[credentials.username];
      if (!email) {
        throw new Error('Invalid username');
      }

      // Use Firebase authentication
      const result = await signInFirebase(email, credentials.password);
      
      // Create user object for compatibility
      const userData = {
        username: credentials.username,
        role: result.role,
        email: email,
        firebaseUser: result.user,
        authenticated: true
      };
      
      return userData;
    } catch (error) {
      console.error('Firebase login error:', error);
      throw error;
    }
  };

  // Firebase sign out
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local storage (cleanup)
      localStorage.removeItem('kmrlUser');
      localStorage.removeItem('kmrlAuth');
      
      // State will be cleared by onAuthStateChanged listener
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Legacy authorization check
  const isAuthorized = (requiredPage) => {
    if (!currentUser || !userRole) return false;
    
    // Admin has access to all pages
    if (userRole === 'Admin') return true;
    
    // Role-specific page access
    const rolePages = {
      'Engineering Officer': ['dashboard', 'engineering', 'engine'],
      'Safety Officer': ['dashboard', 'safety'],
      'Certification Officer': ['dashboard', 'certification'],
      'Maintenance Officer': ['dashboard', 'maintenance'],
      'Operations Officer': ['dashboard', 'operations', 'service'],
      'Driver/Pilot': ['dashboard', 'driver', 'pilot']
    };
    
    return rolePages[userRole]?.includes(requiredPage) || false;
  };

  // Get user pages based on role
  const getUserPages = () => {
    if (!userRole) return [];
    
    if (userRole === 'Admin') {
      return ['dashboard', 'planning', 'engine', 'cleaning', 'certification', 'branding', 'maintenance', 'service'];
    }
    
    const rolePages = {
      'Engineering Officer': ['dashboard', 'engineering'],
      'Safety Officer': ['dashboard', 'safety'],
      'Certification Officer': ['dashboard', 'certification'],
      'Maintenance Officer': ['dashboard', 'maintenance'],
      'Operations Officer': ['dashboard', 'operations'],
      'Driver/Pilot': ['dashboard', 'driver']
    };
    
    return rolePages[userRole] || [];
  };

  // Monitor Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        const role = ROLE_MAPPINGS[user.email];
        setUserRole(role);
        console.log('User authenticated:', user.email, 'Role:', role);
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserRole(null);
        console.log('User signed out');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    // Firebase methods
    currentUser,
    userRole,
    signInFirebase,
    loginWithFirebase,
    
    // Main authentication methods
    user: currentUser ? { 
      username: currentUser.email?.split('@')[0], 
      role: userRole, 
      email: currentUser.email,
      uid: currentUser.uid,
      authenticated: true,
      firebaseUser: currentUser
    } : null,
    login,
    logout,
    isAuthorized,
    getUserPages,
    loading,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;