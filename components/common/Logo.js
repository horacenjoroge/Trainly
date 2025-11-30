import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

/**
 * Logo component for Trainly app
 * Displays a stylized running person icon
 * Memoized to prevent unnecessary re-renders
 */
const Logo = React.memo(() => {
  const theme = useTheme();
  
  return (
    <Svg width="150" height="150" viewBox="0 0 200 200">
      <Circle cx="100" cy="40" r="15" fill={theme.colors.primary}/>
      <Path d="M100 55 L100 95" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      <Path d="M100 65 L130 85" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      <Path d="M100 65 L80 50" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      <Path d="M100 95 L120 140" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      <Path d="M100 95 L80 135" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      <Path d="M120 140 L135 135" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
      <Path d="M80 135 L65 140" stroke={theme.colors.primary} strokeWidth="5" fill="none"/>
    </Svg>
  );
});

Logo.displayName = 'Logo';

export default Logo;

