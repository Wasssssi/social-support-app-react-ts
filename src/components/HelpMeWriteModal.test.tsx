import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider } from '../context/FormContext';
import HelpMeWriteModal from './HelpMeWriteModal';
import { generateText } from '../services/openai';

vi.mock('../services/openai');

describe('HelpMeWriteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnAccept = vi.fn();
  const seedPrompt = 'Test prompt';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('social_support_locale', JSON.stringify('en'));
  });

  it('should not render when open is false', () => {
    render(
      <FormProvider>
        <HelpMeWriteModal
          open={false}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('AI Suggestion')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const closeButton = screen.getByLabelText('Cancel');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when discard button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const discardButton = screen.getByText('Discard');
    await user.click(discardButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should generate text when generate button is clicked', async () => {
    const user = userEvent.setup();
    const mockGeneratedText = 'Generated suggestion text';
    
    vi.mocked(generateText).mockResolvedValue(mockGeneratedText);
    
    // Mock environment variable
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      expect(generateText).toHaveBeenCalledWith('test-key', seedPrompt, expect.any(AbortSignal));
    });

    const textarea = screen.getByLabelText('suggestion') as HTMLTextAreaElement;
    await waitFor(() => {
      expect(textarea.value).toBe(mockGeneratedText);
    });
  });

  it('should show error when API key is missing', async () => {
    const user = userEvent.setup();
    
    vi.stubEnv('VITE_OPENAI_API_KEY', undefined);

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Missing VITE_OPENAI_API_KEY')).toBeInTheDocument();
    });
  });

  it('should show error when generation fails', async () => {
    const user = userEvent.setup();
    
    vi.mocked(generateText).mockRejectedValue(new Error('API Error'));
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Could not generate text. Please try again.')).toBeInTheDocument();
    });
  });

  it('should call onAccept with text when accept button is clicked', async () => {
    const user = userEvent.setup();
    const mockGeneratedText = 'Generated suggestion text';
    
    vi.mocked(generateText).mockResolvedValue(mockGeneratedText);
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByLabelText('suggestion')).toHaveValue(mockGeneratedText);
    });

    const acceptButton = screen.getByText('Accept');
    await user.click(acceptButton);

    expect(mockOnAccept).toHaveBeenCalledWith(mockGeneratedText);
  });

  it('should disable accept button when text is empty', () => {
    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const acceptButton = screen.getByText('Accept');
    expect(acceptButton).toBeDisabled();
  });

  it('should enable accept button when text is present', async () => {
    const user = userEvent.setup();
    const mockGeneratedText = 'Generated suggestion text';
    
    vi.mocked(generateText).mockResolvedValue(mockGeneratedText);
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      const acceptButton = screen.getByText('Accept');
      expect(acceptButton).not.toBeDisabled();
    });
  });

  it('should allow editing text in textarea', async () => {
    const user = userEvent.setup();
    const mockGeneratedText = 'Generated suggestion text';
    
    vi.mocked(generateText).mockResolvedValue(mockGeneratedText);
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByLabelText('suggestion')).toHaveValue(mockGeneratedText);
    });

    const textarea = screen.getByLabelText('suggestion') as HTMLTextAreaElement;
    await user.clear(textarea);
    await user.type(textarea, 'Edited text');
    expect(textarea.value).toBe('Edited text');
  });

  it('should reset text and error when modal closes', async () => {
    const user = userEvent.setup();
    const mockGeneratedText = 'Generated suggestion text';
    
    vi.mocked(generateText).mockResolvedValue(mockGeneratedText);
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    const { rerender } = render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByLabelText('suggestion')).toHaveValue(mockGeneratedText);
    });

    rerender(
      <FormProvider>
        <HelpMeWriteModal
          open={false}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    rerender(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const textarea = screen.getByLabelText('suggestion') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('should show loading state during generation', async () => {
    const user = userEvent.setup();
    let resolveGenerate: (value: string) => void;
    const generatePromise = new Promise<string>((resolve) => {
      resolveGenerate = resolve;
    });
    
    vi.mocked(generateText).mockReturnValue(generatePromise);
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key');

    render(
      <FormProvider>
        <HelpMeWriteModal
          open={true}
          onClose={mockOnClose}
          onAccept={mockOnAccept}
          seedPrompt={seedPrompt}
        />
      </FormProvider>
    );

    const generateButton = screen.getByText('Generate');
    await user.click(generateButton);

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(generateButton).toBeDisabled();

    resolveGenerate!('Generated text');
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });
});

