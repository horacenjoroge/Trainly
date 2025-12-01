// __tests__/services/authService.test.js
import { authService } from '../../services/authService';
import apiClient from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../utils/logger', () => ({
  log: jest.fn(),
  logError: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register user and store tokens', async () => {
      const mockResponse = {
        data: {
          token: 'access-token',
          refreshToken: 'refresh-token',
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);
      AsyncStorage.setItem.mockResolvedValue();

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.register(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'access-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(mockResponse.data.user));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle registration errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'User already exists' },
        },
      };

      apiClient.post.mockRejectedValue(mockError);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('login', () => {
    test('should login user and store tokens', async () => {
      const mockResponse = {
        data: {
          token: 'access-token',
          refreshToken: 'refresh-token',
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);
      AsyncStorage.setItem.mockResolvedValue();

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'access-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(mockResponse.data.user));
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle login errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      };

      apiClient.post.mockRejectedValue(mockError);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    test('should clear tokens and user data', async () => {
      AsyncStorage.removeItem.mockResolvedValue();

      const result = await authService.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
      expect(result).toBe(true);
    });
  });

  describe('refreshToken', () => {
    test('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };

      AsyncStorage.getItem.mockResolvedValue('refresh-token');
      apiClient.post.mockResolvedValue(mockResponse);
      AsyncStorage.setItem.mockResolvedValue();

      const result = await authService.refreshToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refreshToken: 'refresh-token',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'new-access-token');
      expect(result).toBe(true);
    });

    test('should return false when no refresh token', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const result = await authService.refreshToken();

      expect(result).toBe(false);
    });

    test('should handle refresh token errors', async () => {
      AsyncStorage.getItem.mockResolvedValue('refresh-token');
      apiClient.post.mockRejectedValue({
        response: { status: 401, data: { message: 'Invalid refresh token' } },
      });

      const result = await authService.refreshToken();

      expect(result).toBe(false);
    });
  });
});

