import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        // Set header temporarily to check
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
            // Dynamically import api to avoid circular dependencies if any, 
            // or just use axios directly since we set the header.
            // Using a direct axios call to avoid interceptor complexity for this check if possible,
            // or better, use the configured api instance if available. 
            // Let's use basic axios to keep it simple and independent.
            await axios.get('http://localhost:8080/api/auth/validate');
            
            setToken(storedToken);
            setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
            console.error("Token validation failed:", error);
            // Token invalid - clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setCurrentUser(null);
            delete axios.defaults.headers.common['Authorization'];
        }
      } else {
         // Cleanup if partial data
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Sync axios header when token changes (login/logout actions)
  useEffect(() => {
     if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     } else {
        delete axios.defaults.headers.common['Authorization'];
     }
  }, [token]);

  const login = (userData, accessToken) => {
    setCurrentUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  const value = {
    currentUser,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
