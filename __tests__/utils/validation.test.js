// __tests__/utils/validation.test.js
import {
  validateField,
  validateFields,
  isValidEmail,
  validatePassword,
  validationRules,
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateField', () => {
    test('should validate email correctly', () => {
      expect(validateField('email', 'test@example.com')).toBeNull();
      expect(validateField('email', 'invalid-email')).toBeTruthy();
      expect(validateField('email', '')).toBeTruthy();
    });

    test('should validate password correctly', () => {
      expect(validateField('password', 'password123')).toBeNull();
      expect(validateField('password', 'short')).toBeTruthy();
      expect(validateField('password', '12345678')).toBeTruthy(); // No letters
      expect(validateField('password', 'abcdefgh')).toBeTruthy(); // No numbers
    });

    test('should validate fullName correctly', () => {
      expect(validateField('fullName', 'John Doe')).toBeNull();
      expect(validateField('fullName', 'J')).toBeTruthy(); // Too short
      expect(validateField('fullName', 'John123')).toBeTruthy(); // Has numbers
      expect(validateField('fullName', '')).toBeTruthy(); // Required
    });

    test('should validate username correctly', () => {
      expect(validateField('username', 'user123')).toBeNull();
      expect(validateField('username', 'us')).toBeTruthy(); // Too short
      expect(validateField('username', 'user-name')).toBeTruthy(); // Invalid char
      expect(validateField('username', '')).toBeTruthy(); // Required
    });

    test('should validate optional fields', () => {
      expect(validateField('phone', '')).toBeNull(); // Optional
      expect(validateField('phone', '1234567890')).toBeNull();
      expect(validateField('phone', '123')).toBeTruthy(); // Too short
    });

    test('should validate numeric ranges', () => {
      expect(validateField('height', '175')).toBeNull();
      expect(validateField('height', '50')).toBeTruthy(); // Below min
      expect(validateField('height', '300')).toBeTruthy(); // Above max
      expect(validateField('weight', '75.5')).toBeNull();
      expect(validateField('weight', '20')).toBeTruthy(); // Below min
    });

    test('should validate bio length', () => {
      const shortBio = 'Short bio';
      const longBio = 'a'.repeat(151);
      expect(validateField('bio', shortBio)).toBeNull();
      expect(validateField('bio', longBio)).toBeTruthy();
      expect(validateField('bio', '')).toBeNull(); // Optional
    });
  });

  describe('validateFields', () => {
    test('should validate multiple fields', () => {
      const fields = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      };
      const errors = validateFields(fields);
      expect(errors).toEqual({});
    });

    test('should return errors for invalid fields', () => {
      const fields = {
        email: 'invalid-email',
        password: 'short',
        fullName: '',
      };
      const errors = validateFields(fields);
      expect(errors.email).toBeTruthy();
      expect(errors.password).toBeTruthy();
      expect(errors.fullName).toBeTruthy();
    });
  });

  describe('isValidEmail', () => {
    test('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should return valid for strong passwords', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('should return invalid for short passwords', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('8 characters');
    });

    test('should return invalid for passwords without letters', () => {
      const result = validatePassword('12345678');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('letter');
    });

    test('should return invalid for passwords without numbers', () => {
      const result = validatePassword('abcdefgh');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('number');
    });
  });
});

