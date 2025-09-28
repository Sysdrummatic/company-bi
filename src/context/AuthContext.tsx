/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildApiUrl } from '@/lib/api';

interface AuthUser {
  id: number;
  username: string;
  createdAt?: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}
const STORAGE_KEY = 'companybi_auth_state';

interface PersistedAuthState {
  token: string;
  user: AuthUser;
  expiresAt?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readPersistedState = (): PersistedAuthState | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedAuthState;
  } catch (error) {
    console.warn('Failed to parse persisted auth state:', error);
    return null;
  }
};

const persistState = (value: PersistedAuthState | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (value) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const persisted = readPersistedState();

    if (persisted?.token && persisted.user) {
      setToken(persisted.token);
      setUser(persisted.user);
    }

    setIsLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((payload: PersistedAuthState) => {
    setToken(payload.token);
    setUser(payload.user);
    persistState(payload);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await fetch(buildApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let message = 'Nie udało się zalogować';
      try {
        const data = (await response.json()) as { message?: string };
        if (data?.message) {
          message = data.message;
        }
      } catch (error) {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    const data = (await response.json()) as PersistedAuthState;
    handleAuthSuccess(data);
    return data.user;
  }, [handleAuthSuccess]);

  const register = useCallback(async (username: string, password: string) => {
    const response = await fetch(buildApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let message = 'Nie udało się utworzyć konta';
      try {
        const data = (await response.json()) as { message?: string };
        if (data?.message) {
          message = data.message;
        }
      } catch (error) {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    const data = (await response.json()) as PersistedAuthState;
    handleAuthSuccess(data);
    return data.user;
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    persistState(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  }), [token, user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
