// src/context/AuthContext.jsx — Global auth state
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    setUser(data.data);
    setLoading(false);
    return data;
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    const { data } = await API.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    setUser(data.data);
    setLoading(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
