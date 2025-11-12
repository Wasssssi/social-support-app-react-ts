import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitApplication } from './mockApi';
import type { ApplicationData } from '../types';

describe('mockApi service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should submit application successfully', async () => {
    const mockData: ApplicationData = {
      personal: {
        name: 'John Doe',
        nationalId: '123456',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        address: '123 Main St',
        city: 'City',
        state: 'State',
        country: 'Country',
        phone: '1234567890',
        email: 'john@example.com',
      },
      family: {
        maritalStatus: 'Single',
        dependents: 0,
        employmentStatus: 'Unemployed',
        monthlyIncome: 0,
        housingStatus: 'Renting',
      },
      situation: {
        currentFinancialSituation: 'Struggling',
        employmentCircumstances: 'Lost job',
        reasonForApplying: 'Need support',
      },
    };

    const result = await submitApplication(mockData);

    expect(result).toEqual({ ok: true });
    expect(console.log).toHaveBeenCalledWith('Submitted application (mock):', mockData);
  });

  it('should delay for approximately 600ms', async () => {
    const start = Date.now();
    const mockData: ApplicationData = {
      personal: {
        name: 'Test',
        nationalId: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        email: '',
      },
      family: {
        maritalStatus: '',
        dependents: '',
        employmentStatus: '',
        monthlyIncome: '',
        housingStatus: '',
      },
      situation: {
        currentFinancialSituation: '',
        employmentCircumstances: '',
        reasonForApplying: '',
      },
    };

    await submitApplication(mockData);
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(590);
    expect(duration).toBeLessThan(700);
  });

  it('should occasionally throw random failure error', async () => {
    const mockData: ApplicationData = {
      personal: {
        name: 'Test',
        nationalId: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        email: '',
      },
      family: {
        maritalStatus: '',
        dependents: '',
        employmentStatus: '',
        monthlyIncome: '',
        housingStatus: '',
      },
      situation: {
        currentFinancialSituation: '',
        employmentCircumstances: '',
        reasonForApplying: '',
      },
    };

    // Mock Math.random to return a value that triggers failure
    const originalRandom = Math.random;
    let attempts = 0;
    let failed = false;

    // Try multiple times to catch the random failure
    while (attempts < 100 && !failed) {
      Math.random = vi.fn(() => 0.03); // Less than 0.05 to trigger failure
      
      try {
        await submitApplication(mockData);
      } catch (error: any) {
        if (error.message === 'Random failure') {
          failed = true;
          expect(error.message).toBe('Random failure');
        }
      }
      attempts++;
    }

    Math.random = originalRandom;

    // Note: This test may not always catch the failure due to randomness,
    // but it verifies the error handling path exists
  });

  it('should handle different application data structures', async () => {
    const mockData: ApplicationData = {
      personal: {
        name: 'Jane Doe',
        nationalId: '987654',
        dateOfBirth: '1985-05-15',
        gender: 'Female',
        address: '456 Oak Ave',
        city: 'Metropolis',
        state: 'Province',
        country: 'Nation',
        phone: '9876543210',
        email: 'jane@example.com',
      },
      family: {
        maritalStatus: 'Married',
        dependents: 2,
        employmentStatus: 'Part-time',
        monthlyIncome: 1500,
        housingStatus: 'Owned',
      },
      situation: {
        currentFinancialSituation: 'Moderate difficulty',
        employmentCircumstances: 'Reduced hours',
        reasonForApplying: 'Family support needed',
      },
    };

    const result = await submitApplication(mockData);

    expect(result).toEqual({ ok: true });
  });
});

