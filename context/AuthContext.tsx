
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: UserRole) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => void; // To update favorites locally
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('re_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role?: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      // API detects role automatically for existing users.
      // The 'role' arg is only used if creating a NEW user (Registration).
      const userData = await api.login(email, role);
      
      setUser(userData);
      localStorage.setItem('re_session', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('re_session');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const users = await api.getUsers();
      const updated = users.find(u => u.id === user.id);
      if (updated) {
        setUser(updated);
        localStorage.setItem('re_session', JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to refresh user data", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
