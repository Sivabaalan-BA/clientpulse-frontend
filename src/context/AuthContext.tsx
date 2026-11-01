import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  setRole: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const ROLE_EMAILS: Record<UserRole, string> = {
  super_admin: 'superadmin@clientpulse.io',
  business_admin: 'admin@clientpulse.local',
  employee: 'alex.lead@clientpulse.local',
  client: 'marcus@novatech.io',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('business_admin');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('clientpulse_auth_token'));

  // Switch role and automatically retrieve valid cryptographically signed JWT
  const switchRole = async (newRole: UserRole) => {
    setRoleState(newRole);
    const email = ROLE_EMAILS[newRole];
    try {
      const res: any = await api.post('/auth/login', {
        email,
        password: 'admin123',
      });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('clientpulse_auth_token', res.data.token);
    } catch (e) {
      console.error('Role switch authentication failed:', e);
    }
  };

  useEffect(() => {
    switchRole('business_admin');
  }, []);

  const login = async (email: string, password: string = 'admin123'): Promise<boolean> => {
    try {
      const res: any = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      setRoleState(res.data.user.role);
      setToken(res.data.token);
      localStorage.setItem('clientpulse_auth_token', res.data.token);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('clientpulse_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, setRole: switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
