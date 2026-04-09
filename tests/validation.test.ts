import { describe, it, expect } from 'bun:test';
import {
  validateAmount,
  validateDateRange,
  validateStringLength,
  validateRequired,
  validateEnum,
  safePercentage,
} from '../src/utils/validation';

describe('Validation Utilities', () => {
  describe('validateAmount', () => {
    it('should return valid amount rounded to 2 decimals', () => {
      expect(validateAmount(123.456)).toBe(123.46);
      expect(validateAmount(100)).toBe(100);
      expect(validateAmount(99.999)).toBe(100);
    });

    it('should throw for NaN', () => {
      expect(() => validateAmount(NaN)).toThrow('金额必须是有效的数字');
    });

    it('should throw for amount below min', () => {
      expect(() => validateAmount(-10, 0)).toThrow('金额不能小于0');
    });

    it('should throw for amount above max', () => {
      expect(() => validateAmount(100000000, 0, 99999999.99)).toThrow('金额不能大于99999999.99');
    });

    it('should accept custom min/max', () => {
      expect(validateAmount(50, 10, 100)).toBe(50);
      expect(validateAmount(5, 10, 100)).toThrow('金额不能小于10');
    });
  });

  describe('validateDateRange', () => {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    it('should return valid date range', () => {
      const result = validateDateRange(now, nextYear);
      expect(result.startDate).toBe(now);
      expect(result.endDate).toBe(nextYear);
    });

    it('should throw for invalid start date', () => {
      const invalidDate = new Date(NaN);
      expect(() => validateDateRange(invalidDate, now)).toThrow('开始日期无效');
    });

    it('should throw when start date is after end date', () => {
      expect(() => validateDateRange(nextYear, now)).toThrow('开始日期不能大于结束日期');
    });

    it('should throw for range exceeding 10 years', () => {
      const farFuture = new Date(now.getFullYear() + 11, now.getMonth(), now.getDate());
      expect(() => validateDateRange(now, farFuture)).toThrow('日期范围不能超过10年');
    });
  });

  describe('validateStringLength', () => {
    it('should return valid string', () => {
      expect(validateStringLength('hello', 'name', 3, 10)).toBe('hello');
    });

    it('should throw if not a string', () => {
      expect(() => validateStringLength(123 as any, 'name')).toThrow('必须是字符串');
    });

    it('should throw if too short', () => {
      expect(() => validateStringLength('hi', 'name', 5)).toThrow('长度不能小于5');
    });

    it('should throw if too long', () => {
      const longStr = 'a'.repeat(300);
      expect(() => validateStringLength(longStr, 'name', 0, 100)).toThrow('长度不能大于100');
    });
  });

  describe('validateRequired', () => {
    it('should return value if not empty', () => {
      expect(validateRequired('test', 'field')).toBe('test');
      expect(validateRequired(0, 'number')).toBe(0);
      expect(validateRequired(false, 'bool')).toBe(false);
    });

    it('should throw for undefined', () => {
      expect(() => validateRequired(undefined, 'field')).toThrow('不能为空');
    });

    it('should throw for null', () => {
      expect(() => validateRequired(null, 'field')).toThrow('不能为空');
    });

    it('should throw for empty string', () => {
      expect(() => validateRequired('', 'field')).toThrow('不能为空');
    });
  });

  describe('validateEnum', () => {
    const allowedValues = ['apple', 'banana', 'orange'];

    it('should return value if in allowed set', () => {
      expect(validateEnum('apple', allowedValues, 'fruit')).toBe('apple');
    });

    it('should throw for value not in allowed set', () => {
      expect(() => validateEnum('grape', allowedValues, 'fruit')).toThrow('必须是以下值之一');
    });
  });

  describe('safePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(safePercentage(25, 100)).toBe(25);
      expect(safePercentage(50, 200)).toBe(25);
      expect(safePercentage(1, 3)).toBeCloseTo(33.33, 1);
    });

    it('should return 0 for zero total', () => {
      expect(safePercentage(100, 0)).toBe(0);
    });

    it('should return 0 for NaN total', () => {
      expect(safePercentage(100, NaN)).toBe(0);
    });

    it('should clamp result between 0 and 100', () => {
      expect(safePercentage(150, 100)).toBe(100);
      expect(safePercentage(-10, 100)).toBe(0);
    });
  });
});
