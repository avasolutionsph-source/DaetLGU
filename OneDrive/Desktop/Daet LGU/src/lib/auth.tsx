import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'mayor' | 'treasury' | 'bplo' | 'engineering' | 'mdrrmo' | 'barangay' | 'admin' | 'citizen';

export interface CurrentUser {
  name: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  department: string;
}

interface Credential {
  email: string;
  password: string;
  role: UserRole;
}

const CREDENTIALS: Credential[] = [
  { email: 'mayor@daet.gov.ph', password: 'mayor123', role: 'mayor' },
  { email: 'treasury@daet.gov.ph', password: 'treasury123', role: 'treasury' },
  { email: 'bplo@daet.gov.ph', password: 'bplo123', role: 'bplo' },
  { email: 'engineering@daet.gov.ph', password: 'engineering123', role: 'engineering' },
  { email: 'mdrrmo@daet.gov.ph', password: 'mdrrmo123', role: 'mdrrmo' },
  { email: 'barangay@daet.gov.ph', password: 'barangay123', role: 'barangay' },
  { email: 'admin@daet.gov.ph', password: 'admin123', role: 'admin' },
  { email: 'citizen@daet.gov.ph', password: 'citizen123', role: 'citizen' },
];

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const ROLE_PROFILES: Record<UserRole, CurrentUser> = {
  mayor: {
    name: 'Hon. Rossano "Ronie" Valencia',
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
  citizen: {
    name: 'Juan Dela Cruz',
    role: 'citizen',
    roleLabel: 'Citizen',
    avatar: 'JD',
    department: 'Citizen Portal',
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

  const loginWithCredentials = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    const match = CREDENTIALS.find(
      (c) => c.email === trimmedEmail && c.password === password
    );
    if (!match) {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }
    const user = ROLE_PROFILES[match.role];
    setCurrentUser(user);
    localStorage.setItem('daet_lgu_user', JSON.stringify(user));
    return { success: true };
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
        loginWithCredentials,
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
