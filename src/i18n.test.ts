import { describe, it, expect } from 'vitest';
import { t } from './i18n';
import type { Locale } from './types';

describe('i18n', () => {
  describe('t function', () => {
    it('should return English translation for en locale', () => {
      expect(t('en', 'appTitle')).toBe('Social Support Application');
      expect(t('en', 'next')).toBe('Next');
      expect(t('en', 'back')).toBe('Back');
      expect(t('en', 'submit')).toBe('Submit');
    });

    it('should return Arabic translation for ar locale', () => {
      expect(t('ar', 'appTitle')).toBe('طلب دعم اجتماعي');
      expect(t('ar', 'next')).toBe('التالي');
      expect(t('ar', 'back')).toBe('السابق');
      expect(t('ar', 'submit')).toBe('إرسال');
    });

    it('should return key when translation is missing', () => {
      const missingKey = 'nonExistentKey' as any;
      expect(t('en', missingKey)).toBe(missingKey);
      expect(t('ar', missingKey)).toBe(missingKey);
    });

    it('should handle all translation keys for English', () => {
      const keys = [
        'appTitle', 'language', 'english', 'arabic', 'next', 'back', 'submit', 'reset',
        'step1', 'step2', 'step3', 'name', 'nationalId', 'dateOfBirth', 'gender',
        'address', 'city', 'state', 'country', 'phone', 'email', 'maritalStatus',
        'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus',
        'currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying',
        'helpMeWrite', 'aiSuggestion', 'accept', 'edit', 'discard', 'cancel',
        'generate', 'submitSuccess', 'submitError', 'aiError', 'required',
      ] as const;

      keys.forEach(key => {
        const translation = t('en', key as any);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should handle all translation keys for Arabic', () => {
      const keys = [
        'appTitle', 'language', 'english', 'arabic', 'next', 'back', 'submit', 'reset',
        'step1', 'step2', 'step3', 'name', 'nationalId', 'dateOfBirth', 'gender',
        'address', 'city', 'state', 'country', 'phone', 'email', 'maritalStatus',
        'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus',
        'currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying',
        'helpMeWrite', 'aiSuggestion', 'accept', 'edit', 'discard', 'cancel',
        'generate', 'submitSuccess', 'submitError', 'aiError', 'required',
      ] as const;

      keys.forEach(key => {
        const translation = t('ar', key as any);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });
  });
});

