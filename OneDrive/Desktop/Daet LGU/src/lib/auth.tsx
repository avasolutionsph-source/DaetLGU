import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'mayor' | 'treasury' | 'bplo' | 'engineering' | 'mdrrmo' | 'barangay' | 'admin';

export interface CurrentUser {
  name: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  department: string;
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const ROLE_PROFILES: Record<UserRole, CurrentUser> = {
  mayor: {
    name: 'Hon. Elmer Panotes',
    role: 'mayor',
    roleLabel: "Mayor's Office",
    avatar: 'EP',
    department: 'Office of the Municipal Mayor',
  },
  treasury: {
    name: 'Maria Santos',
    role: 'treasury',
    roleLabel: 'Treasury Officer',
    avatar: 'MS',
    department: 'Municipal Treasury Office',
  },
  bplo: {
    name: 'Ricardo Dela Cruz',
    role: 'bplo',
    roleLabel: 'BPLO Officer',
    avatar: 'RD',
    department: 'Business Permits & Licensing Office',
  },
  engineering: {
    name: 'Engr. Paolo Reyes',
    role: 'engineering',
    roleLabel: 'Engineering Officer',
    avatar: 'PR',
    department: 'Municipal Engineering Office',
  },
  mdrrmo: {
    name: 'Capt. Ana Villanueva',
    role: 'mdrrmo',
    roleLabel: 'MDRRMO Head',
    avatar: 'AV',
    department: 'Municipal Disaster Risk Reduction & Management Office',
  },
  barangay: {
    name: 'Kap. Jose Garcia',
    role: 'barangay',
    roleLabel: 'Barangay Captain',
    avatar: 'JG',
    department: 'Barangay Operations Office',
  },
  admin: {
    name: 'System Administrator',
    role: 'admin',
    roleLabel: 'Administrator',
    avatar: 'SA',
    department: 'IT & Systems Administration',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const stored = localStorage.getItem('daet_lgu_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback((role: UserRole) => {
    const user = ROLE_PROFILES[role];
    setCurrentUser(user);
    localStorage.setItem('daet_lgu_user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('daet_lgu_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
