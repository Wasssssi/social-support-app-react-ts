import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadFromStorage, saveToStorage, clearStorage, storageKeys } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('loadFromStorage', () => {
    it('should return parsed value from localStorage', () => {
      const testData = { name: 'John', age: 30 };
      localStorage.setItem('test-key', JSON.stringify(testData));
      
      const result = loadFromStorage('test-key', {});
      
      expect(result).toEqual(testData);
    });

    it('should return fallback when key does not exist', () => {
      const fallback = { default: 'value' };
      const result = loadFromStorage('non-existent', fallback);
      
      expect(result).toBe(fallback);
    });

    it('should return fallback when localStorage value is null', () => {
      const fallback = { default: 'value' };
      const result = loadFromStorage('test-key', fallback);
      
      expect(result).toBe(fallback);
    });

    it('should return fallback when JSON.parse fails', () => {
      localStorage.setItem('test-key', 'invalid json');
      const fallback = { default: 'value' };
      
      const result = loadFromStorage('test-key', fallback);
      
      expect(result).toBe(fallback);
    });

    it('should handle localStorage.getItem throwing an error', () => {
      const fallback = { default: 'value' };
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = loadFromStorage('test-key', fallback);
      
      expect(result).toBe(fallback);
      getItemSpy.mockRestore();
    });
  });

  describe('saveToStorage', () => {
    it('should save value to localStorage as JSON', () => {
      const testData = { name: 'John', age: 30 };
      
      saveToStorage('test-key', testData);
      
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify(testData));
    });

    it('should handle localStorage.setItem throwing an error', () => {
      const testData = { name: 'John' };
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(() => saveToStorage('test-key', testData)).not.toThrow();
      
      setItemSpy.mockRestore();
    });

    it('should handle circular references gracefully', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      expect(() => saveToStorage('test-key', circular)).not.toThrow();
    });
  });

  describe('clearStorage', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      
      clearStorage('test-key');
      
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should handle localStorage.removeItem throwing an error', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(() => clearStorage('test-key')).not.toThrow();
      
      removeItemSpy.mockRestore();
    });
  });

  describe('storageKeys', () => {
    it('should export correct storage keys', () => {
      expect(storageKeys.app).toBe('social_support_application_v1');
      expect(storageKeys.locale).toBe('social_support_locale');
    });
  });
});

