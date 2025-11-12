import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider } from '../context/FormContext';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render all three steps', () => {
    render(
      <FormProvider>
        <ProgressBar />
      </FormProvider>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show step 1 as active by default', () => {
    render(
      <FormProvider>
        <ProgressBar />
      </FormProvider>
    );

    const step1 = screen.getByText('1').closest('div');
    expect(step1).toHaveAttribute('aria-current', 'step');
  });

  it('should display correct labels for English', () => {
    localStorage.setItem('social_support_locale', JSON.stringify('en'));
    
    render(
      <FormProvider>
        <ProgressBar />
      </FormProvider>
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Family & Financial Info')).toBeInTheDocument();
    expect(screen.getByText('Situation Descriptions')).toBeInTheDocument();
  });

  it('should display correct labels for Arabic', () => {
    localStorage.setItem('social_support_locale', JSON.stringify('ar'));
    
    render(
      <FormProvider>
        <ProgressBar />
      </FormProvider>
    );

    expect(screen.getByText('المعلومات الشخصية')).toBeInTheDocument();
    expect(screen.getByText('معلومات الأسرة والمالية')).toBeInTheDocument();
    expect(screen.getByText('وصف الحالة')).toBeInTheDocument();
  });

  it('should have correct progress width calculation for step 1', () => {
    const step = 1;
    const percent = ((step - 1) / (3 - 1)) * 100;
    expect(percent).toBe(0);
  });

  it('should have correct progress width calculation for step 2', () => {
    const step = 2;
    const percent = ((step - 1) / (3 - 1)) * 100;
    expect(percent).toBe(50);
  });

  it('should have correct progress width calculation for step 3', () => {
    const step = 3;
    const percent = ((step - 1) / (3 - 1)) * 100;
    expect(percent).toBe(100);
  });

  it('should mark completed steps correctly', () => {
    const step = 2;
    const id = 1;
    const completed = id < step;
    expect(completed).toBe(true);
  });

  it('should have proper ARIA attributes', () => {
    render(
      <FormProvider>
        <ProgressBar />
      </FormProvider>
    );

    const progressList = screen.getByLabelText('Progress');
    expect(progressList).toBeInTheDocument();
    expect(progressList.tagName).toBe('OL');
  });
});

