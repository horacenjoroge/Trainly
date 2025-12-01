// __tests__/utils/errorHandler.test.js
import { handleApiError } from '../../utils/errorHandler';

describe('Error Handler', () => {
  describe('handleApiError', () => {
    test('should handle network errors', () => {
      const networkError = {
        message: 'Network Error',
        code: 'NETWORK_ERROR',
      };
      const result = handleApiError(networkError, 'Default message');
      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });

    test('should handle 401 unauthorized errors', () => {
      const authError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      const result = handleApiError(authError, 'Default message');
      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });

    test('should handle 404 not found errors', () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };
      const result = handleApiError(notFoundError, 'Default message');
      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });

    test('should handle 500 server errors', () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      const result = handleApiError(serverError, 'Default message');
      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });

    test('should use default message when error message not available', () => {
      const error = {
        response: {
          status: 400,
        },
      };
      const result = handleApiError(error, 'Custom default message');
      expect(result.message).toBe('Custom default message');
    });

    test('should handle errors without response', () => {
      const error = {
        message: 'Something went wrong',
      };
      const result = handleApiError(error, 'Default message');
      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });
  });
});

