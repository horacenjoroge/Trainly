// __tests__/integration/authFlow.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import AuthScreen from '../../screens/AuthScreen';
import { authService } from '../../services/api';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const AppWrapper = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </AuthProvider>
  </ThemeProvider>
);

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Registration Flow', () => {
    test('should complete registration flow successfully', async () => {
      const mockResponse = {
        success: true,
        token: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      authService.register = jest.fn().mockResolvedValue(mockResponse);

      const { getByPlaceholderText, getByText } = render(
        <AppWrapper>
          <AuthScreen />
        </AppWrapper>
      );

      // Switch to registration mode
      const signUpButton = getByText(/sign up/i);
      fireEvent.press(signUpButton);

      // Fill registration form
      const nameInput = getByPlaceholderText(/name/i);
      const emailInput = getByPlaceholderText(/email/i);
      const passwordInput = getByPlaceholderText(/password/i);

      fireEvent.changeText(nameInput, 'Test User');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      // Submit form
      const submitButton = getByText(/register|sign up/i);
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    test('should show error on registration failure', async () => {
      authService.register = jest.fn().mockRejectedValue({
        message: 'Registration failed',
      });

      const { getByPlaceholderText, getByText } = render(
        <AppWrapper>
          <AuthScreen />
        </AppWrapper>
      );

      // Switch to registration
      const signUpButton = getByText(/sign up/i);
      fireEvent.press(signUpButton);

      // Fill and submit form
      fireEvent.changeText(getByPlaceholderText(/name/i), 'Test User');
      fireEvent.changeText(getByPlaceholderText(/email/i), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText(/password/i), 'password123');
      fireEvent.press(getByText(/register|sign up/i));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });
    });
  });

  describe('Login Flow', () => {
    test('should complete login flow successfully', async () => {
      const mockResponse = {
        success: true,
        token: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      authService.login = jest.fn().mockResolvedValue(mockResponse);

      const { getByPlaceholderText, getByText } = render(
        <AppWrapper>
          <AuthScreen />
        </AppWrapper>
      );

      // Fill login form
      const emailInput = getByPlaceholderText(/email/i);
      const passwordInput = getByPlaceholderText(/password/i);

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      // Submit form
      const loginButton = getByText(/sign in|login/i);
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    test('should show error on login failure', async () => {
      authService.login = jest.fn().mockRejectedValue({
        message: 'Invalid credentials',
      });

      const { getByPlaceholderText, getByText } = render(
        <AppWrapper>
          <AuthScreen />
        </AppWrapper>
      );

      // Fill and submit form
      fireEvent.changeText(getByPlaceholderText(/email/i), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText(/password/i), 'wrongpassword');
      fireEvent.press(getByText(/sign in|login/i));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation', () => {
    test('should validate email format', async () => {
      const { getByPlaceholderText, getByText } = render(
        <AppWrapper>
          <AuthScreen />
        </AppWrapper>
      );

      const emailInput = getByPlaceholderText(/email/i);
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(getByText(/sign in|login/i));

      // Should show validation error
      await waitFor(() => {
        expect(authService.login).not.toHaveBeenCalled();
      });
    });

    test('should validate password length', async () => {
      const { getByPlaceholderText, getByText } = render(
        <AppWrapper>
          <AuthScreen />
        </AppWrapper>
      );

      const passwordInput = getByPlaceholderText(/password/i);
      fireEvent.changeText(passwordInput, 'short');
      fireEvent.press(getByText(/sign in|login/i));

      // Should show validation error
      await waitFor(() => {
        expect(authService.login).not.toHaveBeenCalled();
      });
    });
  });
});

