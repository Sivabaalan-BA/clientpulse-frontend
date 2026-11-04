import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithPersona: (personaRole: UserRole) => Promise<{ success: boolean; message?: string }>;
  loginWithSSO: (provider: 'google' | 'supabase' | 'github', personaRole?: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const ROLE_CONFIG: Record<
  UserRole,
  {
    title: string;
    shortTitle: string;
    description: string;
    email: string;
    icon: string;
    color: string;
    badgeStyle: string;
    landingRoute: string;
  }
> = {
  business_admin: {
    title: 'Business Admin (Agency Owner)',
    shortTitle: 'Business Admin',
    description: 'Full agency command center, financials, team management & AI scope builder',
    email: 'admin@clientpulse.local',
    icon: '👑',
    color: 'indigo',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    landingRoute: '/',
  },
  employee: {
    title: 'Employee (Developer / PM)',
    shortTitle: 'Employee (PM)',
    description: 'Delivery sprints, assigned project tasks, deliverables & milestone boards',
    email: 'alex.lead@clientpulse.local',
    icon: '⚡',
    color: 'blue',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    landingRoute: '/',
  },
  client: {
    title: 'Client (Customer Portal)',
    shortTitle: 'Client Portal',
    description: 'External customer portal for milestone sign-offs, invoices & feedback',
    email: 'marcus@novatech.io',
    icon: '🤝',
    color: 'emerald',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    landingRoute: '/portal',
  },
  super_admin: {
    title: 'Super Admin (Platform)',
    shortTitle: 'Super Admin',
    description: 'Platform infrastructure, agency tenant provisioning & system telemetry',
    email: 'superadmin@clientpulse.io',
    icon: '🛡️',
    color: 'purple',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
    landingRoute: '/',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('business_admin');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('clientpulse_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('clientpulse_auth_token');
      if (storedToken) {
        try {
          const res: any = await api.get('/auth/me');
          if (res?.data) {
            setUser({
              id: res.data.id || 'usr-01',
              email: res.data.email,
              firstName: res.data.first_name || 'User',
              lastName: res.data.last_name || '',
              role: res.data.role || 'business_admin',
              organizationId: res.data.organization_id || 'org-clientpulse-demo',
            });
            setRoleState(res.data.role || 'business_admin');
          }
        } catch (e) {
          console.warn('Session expired or invalid, clearing stored token.');
          localStorage.removeItem('clientpulse_auth_token');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string = 'admin123'): Promise<{ success: boolean; message?: string }> => {
    try {
      const res: any = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.data?.token) {
        setUser(res.data.user);
        setRoleState(res.data.user.role);
        setToken(res.data.token);
        localStorage.setItem('clientpulse_auth_token', res.data.token);
        return { success: true };
      }
      return { success: false, message: res?.message || 'Authentication failed' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Invalid credentials' };
    }
  };

  const loginWithPersona = async (personaRole: UserRole): Promise<{ success: boolean; message?: string }> => {
    const config = ROLE_CONFIG[personaRole];
    return login(config.email, 'admin123');
  };

  const loginWithSSO = async (
    provider: 'google' | 'supabase' | 'github',
    personaRole: UserRole = 'business_admin'
  ): Promise<{ success: boolean; message?: string }> => {
    // Authenticate with selected persona credentials via enterprise SSO simulation
    const config = ROLE_CONFIG[personaRole];
    return login(config.email, 'admin123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('clientpulse_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithPersona,
        loginWithSSO,
        logout,
      }}
    >
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
