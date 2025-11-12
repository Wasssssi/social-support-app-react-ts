import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateText } from './openai';
import { http } from './http';

vi.mock('./http');

describe('openai service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate text successfully', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: '  Generated text response  ',
            },
          },
        ],
      },
    };

    (http.post as any) = vi.fn().mockResolvedValue(mockResponse);

    const result = await generateText('test-api-key', 'test prompt');

    expect(result).toBe('Generated text response');
    expect(http.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You help citizens write brief, clear descriptions for a government social support application.',
          },
          { role: 'user', content: 'test prompt' },
        ],
        temperature: 0.7,
      },
      {
        signal: undefined,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      }
    );
  });

  it('should handle AbortSignal', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'Response text',
            },
          },
        ],
      },
    };

    (http.post as any) = vi.fn().mockResolvedValue(mockResponse);
    const signal = new AbortController().signal;

    await generateText('test-api-key', 'test prompt', signal);

    expect(http.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({
        signal,
      })
    );
  });

  it('should throw error when response is empty', async () => {
    const mockResponse = {
      data: {
        choices: [],
      },
    };

    (http.post as any) = vi.fn().mockResolvedValue(mockResponse);

    await expect(generateText('test-api-key', 'test prompt')).rejects.toThrow('Empty AI response');
  });

  it('should throw error when content is missing', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {},
          },
        ],
      },
    };

    (http.post as any) = vi.fn().mockResolvedValue(mockResponse);

    await expect(generateText('test-api-key', 'test prompt')).rejects.toThrow('Empty AI response');
  });

  it('should throw error when choices array is empty', async () => {
    const mockResponse = {
      data: {
        choices: [],
      },
    };

    (http.post as any) = vi.fn().mockResolvedValue(mockResponse);

    await expect(generateText('test-api-key', 'test prompt')).rejects.toThrow('Empty AI response');
  });

  it('should trim whitespace from response', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: '   \n  Trimmed text  \n  ',
            },
          },
        ],
      },
    };

    (http.post as any) = vi.fn().mockResolvedValue(mockResponse);

    const result = await generateText('test-api-key', 'test prompt');

    expect(result).toBe('Trimmed text');
  });

  it('should handle HTTP errors from http service', async () => {
    (http.post as any) = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(generateText('test-api-key', 'test prompt')).rejects.toThrow('Network error');
  });
});

