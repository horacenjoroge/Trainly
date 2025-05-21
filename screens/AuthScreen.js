// AuthScreen.js - Updated version
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen({ navigation, onLogin, onRegister, onAuthSuccess }) {
  const theme = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          console.log('Found existing token, proceeding to main app');
          if (onAuthSuccess) {
            onAuthSuccess({ token });
          }
        } else {
          console.log('No token found, user needs to log in');
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };
    
    checkExistingToken();
  }, [onAuthSuccess]);

  const validateInputs = () => {
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    if (!isLogin && !name.trim()) {
      setError('Name is required');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleAuth = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    
    try {
      let result;
      
      if (isLogin) {
        // Login using the onLogin prop provided by App.js
        console.log('Attempting login with email:', email);
        result = await onLogin({ email, password });
        console.log('Login result:', result);
      } else {
        // Register using the onRegister prop provided by App.js
        console.log('Attempting registration with name:', name, 'and email:', email);
        result = await onRegister({ name, email, password });
        console.log('Registration result:', result);
      }
      
      if (result && result.success) {
        console.log('Authentication successful, user data:', result.user);
        // onAuthSuccess can be called here if needed, but navigation should be handled by App.js
        if (onAuthSuccess) {
          onAuthSuccess(result.user);
        }
      } else {
        // Handle failed authentication
        const errorMessage = result?.message || 'Authentication failed';
        console.error('Auth error:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logo component and other UI elements remain the same...
  const Logo = () => (
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Logo />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {isLogin 
              ? 'Sign in to continue your fitness journey' 
              : 'Join us to start your fitness journey'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form fields remain the same... */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={theme.colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Rest of UI remains the same... */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
              or continue with
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
            >
              <Ionicons name="logo-google" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
            >
              <Ionicons name="logo-apple" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomText, { color: theme.colors.textSecondary }]}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={[styles.switchAuthText, { color: theme.colors.primary }]}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 50,
    fontSize: 16,
    borderRadius: 12,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 16,
  },
  authButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  bottomText: {
    fontSize: 14,
    marginRight: 5,
  },
  switchAuthText: {
    fontSize: 14,
    fontWeight: '600',
  },
});