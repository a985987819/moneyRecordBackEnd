import { describe, it, expect } from 'bun:test';
import { BaseService, safeRowFloat, safeRowInt, mapRow } from '../src/utils/base.service';

describe('BaseService', () => {
  const service = new (class extends BaseService {})();

  describe('getFloat', () => {
    it('should parse float from string', () => {
      const row = { amount: '123.45' };
      expect(service.getFloat(row, 'amount')).toBe(123.45);
    });

    it('should return defaultValue for missing key', () => {
      const row = {};
      expect(service.getFloat(row, 'missing', 0)).toBe(0);
    });

    it('should return defaultValue for NaN', () => {
      const row = { amount: 'invalid' };
      expect(service.getFloat(row, 'amount', 0)).toBe(0);
    });

    it('should handle null and undefined', () => {
      const row = { amount: null };
      expect(service.getFloat(row, 'amount', 0)).toBe(0);
    });
  });

  describe('getInt', () => {
    it('should parse int from string', () => {
      const row = { count: '42' };
      expect(service.getInt(row, 'count')).toBe(42);
    });

    it('should return defaultValue for missing key', () => {
      const row = {};
      expect(service.getInt(row, 'missing', 0)).toBe(0);
    });

    it('should return defaultValue for NaN', () => {
      const row = { count: 'abc' };
      expect(service.getInt(row, 'count', 0)).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(service.calculatePercentage(25, 100)).toBe(25);
      expect(service.calculatePercentage(50, 200)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(service.calculatePercentage(100, 0)).toBe(0);
    });

    it('should clamp between 0 and 100', () => {
      expect(service.calculatePercentage(150, 100)).toBe(100);
      expect(service.calculatePercentage(-10, 100)).toBe(0);
    });
  });

  describe('mapRowToResponse', () => {
    it('should map row to response with string keys', () => {
      const row = {
        id: '1',
        username: 'testuser',
        created_at: '2024-01-01 00:00:00',
      };
      const result = service.mapRowToResponse(
        row,
        {
          id: 'id',
          name: 'username',
          createdAt: 'created_at',
        }
      );
      expect(result).toEqual({
        id: '1',
        name: 'testuser',
        createdAt: '2024-01-01 00:00:00',
      });
    });

    it('should support transform functions', () => {
      const row = {
        first_name: 'John',
        last_name: 'Doe',
      };
      const result = service.mapRowToResponse(
        row,
        {
          fullName: (r) => `${r.first_name} ${r.last_name}`,
        }
      );
      expect(result.fullName).toBe('John Doe');
    });
  });
});

describe('safeRowFloat', () => {
  it('should parse valid float strings', () => {
    expect(safeRowFloat({ val: '123.45' }, 'val')).toBe(123.45);
    expect(safeRowFloat({ val: '0.99' }, 'val')).toBe(0.99);
  });

  it('should handle integer strings', () => {
    expect(safeRowFloat({ val: '100' }, 'val')).toBe(100);
  });

  it('should return defaultValue for invalid values', () => {
    expect(safeRowFloat({ val: 'abc' }, 'val', 0)).toBe(0);
    expect(safeRowFloat({ val: null }, 'val', 10)).toBe(10);
    expect(safeRowFloat({ val: undefined }, 'val', 5)).toBe(5);
  });
});

describe('safeRowInt', () => {
  it('should parse valid integer strings', () => {
    expect(safeRowInt({ count: '42' }, 'count')).toBe(42);
    expect(safeRowInt({ count: '100' }, 'count')).toBe(100);
  });

  it('should return defaultValue for invalid values', () => {
    expect(safeRowInt({ count: 'abc' }, 'count', 0)).toBe(0);
    expect(safeRowInt({ count: null }, 'count', 5)).toBe(5);
  });

  it('should truncate decimal values', () => {
    expect(safeRowInt({ count: '42.7' }, 'count')).toBe(42);
  });
});

describe('mapRow', () => {
  it('should map simple fields', () => {
    const row = { id: 1, name: 'test', price: '99.99' };
    const result = mapRow(
      row,
      {
        id: 'id',
        name: 'name',
        price: 'price',
      }
    );
    expect(result).toEqual({ id: 1, name: 'test', price: '99.99' });
  });

  it('should handle mixed string and function mappings', () => {
    const row = { first: 'John', last: 'Doe', age: '30' };
    const result = mapRow(
      row,
      {
        fullName: (r) => `${r.first} ${r.last}`,
        age: 'age',
      }
    );
    expect(result.fullName).toBe('John Doe');
    expect(result.age).toBe('30');
  });
});
