// components/common/Input.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * Reusable Input component with validation and error handling
 * 
 * @param {Object} props
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Label text (optional)
 * @param {string} props.error - Error message (optional)
 * @param {string} props.keyboardType - Keyboard type
 * @param {boolean} props.secureTextEntry - Password input
 * @param {boolean} props.multiline - Multiline input
 * @param {number} props.maxLength - Maximum length
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.icon - Ionicons icon name (optional)
 * @param {Function} props.onIconPress - Icon press handler (optional)
 * @param {Object} props.style - Additional container styles
 * @param {Object} props.inputStyle - Additional input styles
 * @param {boolean} props.disabled - Disabled state
 * @returns {JSX.Element} The rendered Input component
 */
const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  maxLength,
  required = false,
  icon,
  onIconPress,
  style,
  inputStyle,
  disabled = false,
  ...rest
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getInputStyle = () => {
    const baseStyle = [
      styles.input,
      {
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: error
          ? colors.error
          : isFocused
          ? colors.primary
          : colors.border || 'rgba(0,0,0,0.1)',
      },
    ];

    if (multiline) {
      baseStyle.push(styles.multiline);
    }

    if (disabled) {
      baseStyle.push({ opacity: 0.6 });
    }

    return baseStyle;
  };

  const handleSecureTextEntry = secureTextEntry && !showPassword;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        {icon && !secureTextEntry && (
          <Ionicons
            name={icon}
            size={20}
            color={colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={handleSecureTextEntry}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...rest}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {icon && secureTextEntry && onIconPress && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
            <Ionicons name={icon} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default Input;

