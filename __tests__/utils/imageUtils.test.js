// __tests__/utils/imageUtils.test.js
import { getSafeImageUri } from '../../utils/imageUtils';

describe('Image Utils', () => {
  const API_URL = 'https://trainingapp-api-production.up.railway.app';

  describe('getSafeImageUri', () => {
    test('should return require for non-string values', () => {
      const result = getSafeImageUri(null);
      expect(result).toBeDefined();
    });

    test('should return default image for empty strings', () => {
      const result = getSafeImageUri('');
      expect(result).toBeDefined();
    });

    test('should return default image for null/undefined strings', () => {
      expect(getSafeImageUri('null')).toBeDefined();
      expect(getSafeImageUri('undefined')).toBeDefined();
    });

    test('should handle file:// URIs', () => {
      const fileUri = 'file:///path/to/image.jpg';
      const result = getSafeImageUri(fileUri);
      expect(result.uri).toBe(fileUri);
    });

    test('should handle /data/ paths', () => {
      const dataPath = '/data/user/0/image.jpg';
      const result = getSafeImageUri(dataPath);
      expect(result.uri).toBe(`file://${dataPath}`);
    });

    test('should handle ExperienceData paths', () => {
      const expPath = 'file:///ExperienceData/image.jpg';
      const result = getSafeImageUri(expPath);
      expect(result.uri).toBe(expPath);
    });

    test('should handle server paths starting with /uploads/', () => {
      const serverPath = '/uploads/avatars/user.jpg';
      const result = getSafeImageUri(serverPath);
      expect(result.uri).toBe(`${API_URL}${serverPath}`);
    });

    test('should handle server paths starting with /', () => {
      const serverPath = '/images/photo.jpg';
      const result = getSafeImageUri(serverPath);
      expect(result.uri).toBe(`${API_URL}${serverPath}`);
    });

    test('should handle full HTTP URLs', () => {
      const httpUrl = 'http://example.com/image.jpg';
      const result = getSafeImageUri(httpUrl);
      expect(result.uri).toBe(httpUrl);
    });

    test('should handle full HTTPS URLs', () => {
      const httpsUrl = 'https://example.com/image.jpg';
      const result = getSafeImageUri(httpsUrl);
      expect(result.uri).toBe(httpsUrl);
    });

    test('should handle default-avatar-url string', () => {
      const result = getSafeImageUri('default-avatar-url');
      expect(result).toBeDefined();
    });

    test('should add base URL for local paths without http', () => {
      const localPath = 'images/photo.jpg';
      const result = getSafeImageUri(localPath);
      expect(result.uri).toBe(`${API_URL}/${localPath}`);
    });

    test('should return default image as fallback', () => {
      const invalidPath = 'some-invalid-path';
      const result = getSafeImageUri(invalidPath);
      expect(result).toBeDefined();
    });
  });
});

