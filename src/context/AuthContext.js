import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, getUserById } from '../utils/database';

const AuthContext = createContext();

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

  // Check for remembered user on app start
  useEffect(() => {
    checkRememberedUser();
  }, []);

  const checkRememberedUser = async () => {
    try {
      const rememberedUserId = await AsyncStorage.getItem('rememberedUserId');
      if (rememberedUserId) {
        const userData = await getUserById(parseInt(rememberedUserId));
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error checking remembered user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password, role = 'customer') => {
    try {
      const userData = await registerUser(fullName, email, password, role);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signin = async (email, password, rememberMe = false) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      
      // Save user ID to AsyncStorage if "Remember me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedUserId', userData.id.toString());
      } else {
        await AsyncStorage.removeItem('rememberedUserId');
      }
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signout = async () => {
    try {
      await AsyncStorage.removeItem('rememberedUserId');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isCustomer = () => {
    return user?.role === 'customer';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        signin,
        signout,
        isAdmin,
        isCustomer,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
