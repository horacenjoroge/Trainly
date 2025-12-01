// __tests__/utils/dateUtils.test.js
import {
  formatDate,
  formatTime,
  formatDuration,
  formatRelativeTime,
  formatDateTime,
  formatSmartDate,
  isToday,
  isYesterday,
  getDateRange,
} from '../../utils/dateUtils';

describe('Date Utils', () => {
  const mockDate = new Date('2024-01-15T10:30:00Z');

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const formatted = formatDate(mockDate);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Jan');
    });

    test('should handle invalid dates', () => {
      const invalid = formatDate(new Date('invalid'));
      expect(invalid).toBe('');
    });

    test('should handle null/undefined', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatTime', () => {
    test('should format time correctly', () => {
      const formatted = formatTime(mockDate);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    test('should include seconds when requested', () => {
      const formatted = formatTime(mockDate, true);
      expect(formatted).toBeDefined();
    });
  });

  describe('formatDuration', () => {
    test('should format duration in seconds', () => {
      expect(formatDuration(3661)).toBe('1h 1m'); // 1 hour, 1 minute
      expect(formatDuration(125)).toBe('2m'); // 2 minutes, 5 seconds
      expect(formatDuration(45)).toBe('0m'); // Less than a minute
    });

    test('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0m');
    });

    test('should handle large durations', () => {
      expect(formatDuration(36000)).toBe('10h 0m'); // 10 hours
    });

    test('should show seconds when requested', () => {
      expect(formatDuration(45, true)).toContain('s');
    });
  });

  describe('formatRelativeTime', () => {
    test('should return "just now" for very recent dates', () => {
      const recent = new Date(Date.now() - 30000); // 30 seconds ago
      const result = formatRelativeTime(recent);
      expect(result).toBe('just now');
    });

    test('should return minutes ago for recent dates', () => {
      const recent = new Date(Date.now() - 120000); // 2 minutes ago
      const result = formatRelativeTime(recent);
      expect(result).toContain('minute');
    });

    test('should return hours ago', () => {
      const recent = new Date(Date.now() - 7200000); // 2 hours ago
      const result = formatRelativeTime(recent);
      expect(result).toContain('hour');
    });

    test('should return days ago', () => {
      const recent = new Date(Date.now() - 172800000); // 2 days ago
      const result = formatRelativeTime(recent);
      expect(result).toContain('day');
    });
  });

  describe('formatDateTime', () => {
    test('should format date and time', () => {
      const formatted = formatDateTime(mockDate);
      expect(formatted).toContain('at');
      expect(formatted).toBeDefined();
    });
  });

  describe('isToday', () => {
    test('should return true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    test('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    test('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });
  });

  describe('formatSmartDate', () => {
    test('should return "Today" for today', () => {
      const result = formatSmartDate(new Date());
      expect(result).toBe('Today');
    });

    test('should return "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatSmartDate(yesterday);
      expect(result).toBe('Yesterday');
    });

    test('should include time when requested', () => {
      const result = formatSmartDate(new Date(), true);
      expect(result).toContain('Today at');
    });
  });

  describe('getDateRange', () => {
    test('should return week range', () => {
      const range = getDateRange('week');
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
    });

    test('should return month range', () => {
      const range = getDateRange('month');
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
    });

    test('should return year range', () => {
      const range = getDateRange('year');
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
    });
  });
});

