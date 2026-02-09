import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'light', 'dark', or 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeTheme = theme;
      
      if (theme === 'system') {
        activeTheme = systemQuery.matches ? 'dark' : 'light';
      }

      setResolvedTheme(activeTheme);
      
      if (activeTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    };

    applyTheme();

    const listener = () => applyTheme();
    systemQuery.addEventListener('change', listener);
    
    return () => systemQuery.removeEventListener('change', listener);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
