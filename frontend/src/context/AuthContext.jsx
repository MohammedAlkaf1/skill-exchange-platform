import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginUser = (userData, access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
