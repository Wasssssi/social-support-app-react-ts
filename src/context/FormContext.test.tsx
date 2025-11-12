import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FormProvider, useFormContextSafe } from './FormContext';
import { initialData } from './data';
import { storageKeys } from '../utils/storage';
import type { ApplicationData } from '../types';

function TestComponent() {
  const context = useFormContextSafe();
  return (
    <div>
      <div data-testid="step">{context.step}</div>
      <div data-testid="locale">{context.locale}</div>
      <div data-testid="isRtl">{context.isRtl ? 'true' : 'false'}</div>
      <div data-testid="name">{context.data.personal.name}</div>
      <button onClick={() => context.setStep(2)}>Set Step 2</button>
      <button onClick={() => context.updateData({ personal: { ...context.data.personal, name: 'Updated' } })}>
        Update Name
      </button>
      <button onClick={() => context.reset()}>Reset</button>
      <button onClick={() => context.setLocale('ar')}>Set Arabic</button>
    </div>
  );
}

describe('FormContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('FormProvider', () => {
    it('should provide initial data from localStorage', () => {
      const savedData: ApplicationData = {
        ...initialData,
        personal: { ...initialData.personal, name: 'Saved Name' },
      };
      localStorage.setItem(storageKeys.app, JSON.stringify(savedData));

      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      expect(screen.getByTestId('name')).toHaveTextContent('Saved Name');
    });

    it('should use initialData when localStorage is empty', () => {
      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      expect(screen.getByTestId('name')).toHaveTextContent('');
      expect(screen.getByTestId('step')).toHaveTextContent('1');
    });

    it('should load locale from localStorage', () => {
      localStorage.setItem(storageKeys.locale, JSON.stringify('ar'));

      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      expect(screen.getByTestId('locale')).toHaveTextContent('ar');
      expect(screen.getByTestId('isRtl')).toHaveTextContent('true');
    });

    it('should default to English locale', () => {
      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      expect(screen.getByTestId('locale')).toHaveTextContent('en');
      expect(screen.getByTestId('isRtl')).toHaveTextContent('false');
    });

    it('should save data to localStorage when updated', () => {
      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      act(() => {
        screen.getByText('Update Name').click();
      });

      const saved = JSON.parse(localStorage.getItem(storageKeys.app) || '{}');
      expect(saved.personal.name).toBe('Updated');
    });

    it('should update step', () => {
      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      act(() => {
        screen.getByText('Set Step 2').click();
      });

      expect(screen.getByTestId('step')).toHaveTextContent('2');
    });

    it('should update locale and set RTL', () => {
      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      act(() => {
        screen.getByText('Set Arabic').click();
      });

      expect(screen.getByTestId('locale')).toHaveTextContent('ar');
      expect(screen.getByTestId('isRtl')).toHaveTextContent('true');
      expect(document.documentElement.dir).toBe('rtl');
    });

    it('should reset data and step', async () => {
      const savedData: ApplicationData = {
        ...initialData,
        personal: { ...initialData.personal, name: 'Test Name' },
      };
      localStorage.setItem(storageKeys.app, JSON.stringify(savedData));

      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      act(() => {
        screen.getByText('Set Step 2').click();
        screen.getByText('Update Name').click();
      });

      expect(screen.getByTestId('step')).toHaveTextContent('2');
      expect(screen.getByTestId('name')).toHaveTextContent('Updated');

      act(() => {
        screen.getByText('Reset').click();
      });

      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(screen.getByTestId('step')).toHaveTextContent('1');
      expect(screen.getByTestId('name')).toHaveTextContent('');
      // After reset, data is saved to localStorage again via useEffect, so it won't be null
      // but it should be the initial empty data
      const saved = JSON.parse(localStorage.getItem(storageKeys.app) || '{}');
      expect(saved.personal.name).toBe('');
    });

    it('should update document direction when locale changes', () => {
      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      expect(document.documentElement.dir).toBe('ltr');

      act(() => {
        screen.getByText('Set Arabic').click();
      });

      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  describe('useFormContextSafe', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('FormContext used outside provider');

      consoleSpy.mockRestore();
    });
  });
});

