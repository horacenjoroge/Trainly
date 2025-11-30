// hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook to monitor network connectivity status
 * 
 * @returns {Object} Network status object with isConnected, isInternetReachable, and type
 */
const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: null,
    details: null,
  });

  useEffect(() => {
    // Get initial network state
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        details: state.details,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return networkState;
};

export default useNetworkStatus;

