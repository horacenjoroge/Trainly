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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/common/Logo';
import { log, logError } from '../utils/logger';

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
          log('Found existing token, proceeding to main app');
          if (onAuthSuccess) {
            onAuthSuccess({ token });
          }
        } else {
          log('No token found, user needs to log in');
        }
      } catch (error) {
        logError('Error checking token:', error);
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
    
    // Password validation - improved security
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    // Check for at least one number and one letter
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNumber || !hasLetter) {
      setError('Password must contain at least one letter and one number');
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
        log('Attempting login with email:', email);
        result = await onLogin({ email, password });
        log('Login result:', result);
      } else {
        // Register using the onRegister prop provided by App.js
        log('Attempting registration with name:', name, 'and email:', email);
        result = await onRegister({ name, email, password });
        log('Registration result:', result);
      }
      
      if (result && result.success) {
        log('Authentication successful, user data:', result.user);
        // onAuthSuccess can be called here if needed, but navigation should be handled by App.js
        if (onAuthSuccess) {
          onAuthSuccess(result.user);
        }
      } else {
        // Handle failed authentication
        const errorMessage = result?.message || 'Authentication failed';
        logError('Auth error:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      logError('Auth error:', error);
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


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
          <View style={[styles.errorContainer, { backgroundColor: `${theme.colors.error}20`, borderColor: theme.colors.error }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
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