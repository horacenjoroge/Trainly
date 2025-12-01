// __tests__/hooks/useImageUpload.test.js
import { renderHook, act } from '@testing-library/react-native';
import { useImageUpload } from '../../hooks/useImageUpload';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('expo-image-picker');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe('useImageUpload Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with uploading false', () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.uploading).toBe(false);
  });

  test('should have pickImage function', () => {
    const { result } = renderHook(() => useImageUpload());
    expect(typeof result.current.pickImage).toBe('function');
  });

  test('should have uploadAvatar function', () => {
    const { result } = renderHook(() => useImageUpload());
    expect(typeof result.current.uploadAvatar).toBe('function');
  });

  test('should set uploading to true during upload', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ avatar: 'https://example.com/avatar.jpg' }),
    };

    global.fetch.mockResolvedValue(mockResponse);
    AsyncStorage.getItem.mockResolvedValue('token');

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      const uploadPromise = result.current.uploadAvatar('file://image.jpg');
      // Check uploading state
      expect(result.current.uploading).toBe(true);
      await uploadPromise;
    });

    expect(result.current.uploading).toBe(false);
  });

  test('should handle upload errors', async () => {
    global.fetch.mockRejectedValue(new Error('Upload failed'));
    AsyncStorage.getItem.mockResolvedValue('token');

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await expect(
        result.current.uploadAvatar('file://image.jpg')
      ).rejects.toThrow();
    });
  });

  test('should request camera permissions for camera source', async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      status: 'granted',
    });
    ImagePicker.launchCameraAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://image.jpg' }],
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ avatar: 'https://example.com/avatar.jpg' }),
    });
    AsyncStorage.getItem.mockResolvedValue('token');

    const { result } = renderHook(() => useImageUpload());
    const onSuccess = jest.fn();

    await act(async () => {
      await result.current.pickImage('camera', onSuccess);
    });

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
  });

  test('should request media library permissions for gallery source', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      status: 'granted',
    });
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://image.jpg' }],
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ avatar: 'https://example.com/avatar.jpg' }),
    });
    AsyncStorage.getItem.mockResolvedValue('token');

    const { result } = renderHook(() => useImageUpload());
    const onSuccess = jest.fn();

    await act(async () => {
      await result.current.pickImage('gallery', onSuccess);
    });

    expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  });

  test('should show alert when permission denied', async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.pickImage('camera');
    });

    expect(Alert.alert).toHaveBeenCalled();
  });

  test('should not upload when image picker is canceled', async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      status: 'granted',
    });
    ImagePicker.launchCameraAsync.mockResolvedValue({
      canceled: true,
    });

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.pickImage('camera');
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

