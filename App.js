import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import MainComponent from './screens/MainComponent';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <MainComponent />
    </ThemeProvider>
  );
}