// components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * Reusable Button component with multiple variants
 * 
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'text' | 'danger'
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.icon - Ionicons icon name (optional)
 * @param {string} props.iconPosition - 'left' | 'right'
 * @param {Object} props.style - Additional styles
 * @param {Object} props.textStyle - Additional text styles
 * @param {boolean} props.fullWidth - Full width button
 * @returns {JSX.Element} The rendered Button component
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    switch (variant) {
      case 'primary':
        baseStyle.push({ backgroundColor: colors.primary });
        break;
      case 'secondary':
        baseStyle.push({ backgroundColor: colors.secondary || colors.surface });
        break;
      case 'outline':
        baseStyle.push({
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        });
        break;
      case 'text':
        baseStyle.push({ backgroundColor: 'transparent' });
        break;
      case 'danger':
        baseStyle.push({ backgroundColor: colors.error || '#ff3b30' });
        break;
      default:
        baseStyle.push({ backgroundColor: colors.primary });
    }

    if (disabled || loading) {
      baseStyle.push({ opacity: 0.6 });
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        baseTextStyle.push({ color: '#FFFFFF' });
        break;
      case 'outline':
        baseTextStyle.push({ color: colors.primary });
        break;
      case 'text':
        baseTextStyle.push({ color: colors.primary });
        break;
      default:
        baseTextStyle.push({ color: '#FFFFFF' });
    }

    return baseTextStyle;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    return (
      <Ionicons
        name={icon}
        size={iconSize}
        color={getIconColor()}
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && renderIcon()}
          {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Icon styles
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;

