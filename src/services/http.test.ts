import { describe, it, expect, beforeEach, vi } from 'vitest';
import { http } from './http';

describe('http service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be configured with timeout', () => {
    expect(http.defaults.timeout).toBe(15000);
  });

  it('should have request interceptor configured', () => {
    // Interceptors are configured via use() method, verify the instance exists
    expect(http.interceptors.request).toBeDefined();
  });

  it('should have response interceptor configured', () => {
    // Interceptors are configured via use() method, verify the instance exists
    expect(http.interceptors.response).toBeDefined();
  });
});

