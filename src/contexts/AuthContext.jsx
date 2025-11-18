import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, adminAPI, setAuthToken, setUserProfile, getUserProfile, isAuthenticated } from '@/services/api';
import { signInSupabase, signOutSupabase } from '@/services/supabase'

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in on app start
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const profile = getUserProfile();
          if (profile) {
            setUser(profile);
            setIsLoggedIn(true);
          } else {
            // Token exists but no profile, fetch from server
            const resp = await authAPI.getProfile();
            const userProfile = resp?.user || null;
            if (userProfile) {
              setUser(userProfile);
              setUserProfile(userProfile);
              setIsLoggedIn(true);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid token
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Update user profile in context and localStorage (merge by default)
  const updateUser = (updated, options = { merge: true }) => {
    try {
      const nextUser = options.merge && user ? { ...user, ...updated } : updated;
      setUser(nextUser);
      setUserProfile(nextUser);
      setIsLoggedIn(true);
      return nextUser;
    } catch (err) {
      console.error('Failed to update user in context:', err);
      return user;
    }
  };

  // Refresh user profile from backend and sync context/localStorage
  const refreshProfile = async () => {
    try {
      const resp = await authAPI.getProfile();
      const userProfile = resp?.user || null;
      if (userProfile) {
        setUser(userProfile);
        setUserProfile(userProfile);
        setIsLoggedIn(true);
      }
      return userProfile;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      return null;
    }
  };

  const login = async (email, password, options = { remember: true }) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Backend returns: { success: true, user: {...}, token: "..." }
      if (response.success && response.token && response.user) {
        const { token, user: userProfile } = response;
        
        setAuthToken(token, options);
        setUserProfile(userProfile, options);
        setUser(userProfile);
        setIsLoggedIn(true);
        
        return { success: true, user: userProfile };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const loginAdmin = async (email, password, options = { remember: true }) => {
    try {
      const response = await adminAPI.login(email, password);
      if (response.success && response.token && response.user) {
        const { token, user: userProfile } = response;
        setAuthToken(token, options);
        setUserProfile(userProfile, options);
        setUser(userProfile);
        setIsLoggedIn(true);
        // Bridge Supabase auth: sign in if admin
        try {
          if (userProfile?.role === 'admin') {
            await signInSupabase(email, password)
          } else {
            await signOutSupabase()
          }
        } catch (supaErr) {
          console.warn('Supabase auth bridge failed:', supaErr?.message || supaErr)
        }
        return { success: true, user: userProfile };
      }
      throw new Error(response.message || 'Admin login failed');
    } catch (error) {
      console.error('Admin login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData, options = { remember: true }) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: userProfile } = response;
      
      setAuthToken(token, options);
      setUserProfile(userProfile, options);
      setUser(userProfile);
      setIsLoggedIn(true);
      try {
        const uid = userProfile?._id || userProfile?.id || userProfile?.email
        if (uid) {
          localStorage.setItem(`onboardingPending:${uid}`, 'true')
        }
      } catch {}
      
      return { success: true, user: userProfile };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsLoggedIn(false);
    // Ensure Supabase session is cleared
    try { signOutSupabase() } catch {}
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    loginAdmin,
    register,
    logout,
    updateUser,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
