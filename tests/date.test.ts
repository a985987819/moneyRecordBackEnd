import { describe, it, expect } from 'bun:test';
import { formatDateTime, extractDate } from '../src/utils/date';

describe('Date Utilities', () => {
  describe('formatDateTime', () => {
    it('should format timestamp to datetime string', () => {
      const timestamp = 1704067200000; // 2024-01-01 00:00:00
      expect(formatDateTime(timestamp)).toBe('2024-01-01 00:00:00');
    });

    it('should format date string to datetime with time', () => {
      expect(formatDateTime('2024-01-01')).toBe('2024-01-01 00:00:00');
    });

    it('should return unchanged if already in correct format', () => {
      const dateStr = '2024-01-01 12:30:45';
      expect(formatDateTime(dateStr)).toBe(dateStr);
    });

    it('should parse ISO string', () => {
      const isoString = '2024-06-15T14:30:00.000Z';
      const result = formatDateTime(isoString);
      // Result will be in local time but should match date part
      expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });

    it('should throw for invalid input', () => {
      expect(() => formatDateTime('')).toThrow('Invalid date input');
    });
  });

  describe('extractDate', () => {
    it('should extract date part from datetime string', () => {
      expect(extractDate('2024-01-01 12:30:45')).toBe('2024-01-01');
    });

    it('should handle date-only strings', () => {
      expect(extractDate('2024-01-01')).toBe('2024-01-01');
    });
  });
});
