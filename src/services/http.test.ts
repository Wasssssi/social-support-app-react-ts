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
    expect(http.interceptors.request.handlers.length).toBeGreaterThan(0);
  });

  it('should have response interceptor configured', () => {
    expect(http.interceptors.response.handlers.length).toBeGreaterThan(0);
  });
});

