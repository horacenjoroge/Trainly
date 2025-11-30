// components/common/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * Reusable Card component with consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional styles
 * @param {number} props.elevation - Shadow elevation (0-5)
 * @param {boolean} props.padding - Add default padding (default: true)
 * @param {number} props.paddingSize - Padding size (default: 16)
 * @param {boolean} props.margin - Add default margin (default: false)
 * @returns {JSX.Element} The rendered Card component
 */
const Card = ({
  children,
  style,
  elevation = 2,
  padding = true,
  paddingSize = 16,
  margin = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const getCardStyle = () => {
    const cardStyle = [
      styles.card,
      {
        backgroundColor: colors.surface,
        borderRadius: 12,
      },
    ];

    // Add elevation/shadow
    if (elevation > 0) {
      cardStyle.push({
        elevation,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: elevation / 2 },
        shadowOpacity: 0.1,
        shadowRadius: elevation,
      });
    }

    // Add padding
    if (padding) {
      cardStyle.push({ padding: paddingSize });
    }

    // Add margin
    if (margin) {
      cardStyle.push({ margin: 16 });
    }

    return cardStyle;
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    // Base styles applied dynamically
  },
});

export default Card;

