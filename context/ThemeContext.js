import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    colors: isDarkMode ? {
      background: '#121212',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#2C2C2C',
      primary: '#2196F3',
      card: '#252525',
      success: '#4CAF50',
      error: '#f44336',
    } : {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      border: '#F0F0F0',
      primary: '#2196F3',
      card: '#FFFFFF',
      success: '#4CAF50',
      error: '#f44336',
    },
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode(!isDarkMode),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);