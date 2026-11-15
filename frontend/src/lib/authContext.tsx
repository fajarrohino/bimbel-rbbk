'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient, { setAccessToken, clearAccessToken, AuthExpiredError } from '@/lib/apiClient';
import { AdminUser } from '@/types';

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from httpOnly cookie via /api/auth/refresh HANYA di halaman admin
  useEffect(() => {
    const isAdminRoute = pathname?.startsWith('/admin');

    // Jika bukan halaman admin (halaman publik atau login), lewati pemanggilan refresh
    if (!isAdminRoute) {
      if (!user) {
        setIsLoading(false);
      }
      return;
    }

    // Jika sudah di halaman admin dan user sudah terautentikasi di memori, tidak perlu restore lagi
    if (user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function restoreSession() {
      setIsLoading(true);
      try {
        const data = await apiClient.post<{ accessToken: string }>('/api/auth/refresh', {});
        if (data?.accessToken && isMounted) {
          setAccessToken(data.accessToken);
          setAccessTokenState(data.accessToken);
          // Fetch user profile
          const me = await apiClient.get<any>('/api/auth/me');
          if (isMounted) {
            setUser(me?.user || me);
          }
        }
      } catch {
        // No valid refresh token — not authenticated
        if (isMounted) {
          clearAccessToken();
          setAccessTokenState(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, user]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await apiClient.post<{ accessToken: string; user: AdminUser }>('/api/auth/login', {
        username,
        password,
      });
      setAccessToken(data.accessToken);
      setAccessTokenState(data.accessToken);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(error?.message || 'Username atau password salah.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // ignore errors during logout
    }
    clearAccessToken();
    setAccessTokenState(null);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiClient.post<{ accessToken: string }>('/api/auth/refresh');
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setAccessTokenState(data.accessToken);
      }
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        clearAccessToken();
        setAccessTokenState(null);
        setUser(null);
      }
    }
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !isLoading && !!user,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

// HOC for protecting admin routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();


    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Memuat sesi...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

