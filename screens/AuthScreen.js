// AuthScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen({ navigation }) {
  const theme = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    try {
      const userData = { name, email };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      navigation.replace('Main');
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

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
          >
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

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