import { renderHook, act } from '@testing-library/react';
import { useGameResults } from '../useGameResults';
import { submitGameResults } from '../../services/gameResultsApi';

// Mock the API service
jest.mock('../../services/gameResultsApi');

describe('useGameResults', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useGameResults());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.lastSubmission).toBe(null);
    expect(typeof result.current.submitResults).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should handle successful submission', async () => {
    // Mock successful API call
    submitGameResults.mockResolvedValueOnce();

    const { result } = renderHook(() => useGameResults());

    await act(async () => {
      await result.current.submitResults('test@example.com', 5);
    });

    expect(submitGameResults).toHaveBeenCalledWith('test@example.com', 5);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.lastSubmission).toEqual({
      email: 'test@example.com',
      score: 5,
      timestamp: expect.any(String),
      status: 'success'
    });
  });

  it('should handle submission errors gracefully', async () => {
    // Mock API error
    const errorMessage = 'Network error';
    submitGameResults.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useGameResults());

    await act(async () => {
      await result.current.submitResults('test@example.com', 3);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.lastSubmission).toEqual({
      email: 'test@example.com',
      score: 3,
      timestamp: expect.any(String),
      status: 'error',
      error: errorMessage
    });
    expect(console.error).toHaveBeenCalledWith(
      'Game results submission failed:',
      expect.any(Error)
    );
  });

  it('should set isSubmitting to true during submission', async () => {
    // Mock API call with delay
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    submitGameResults.mockReturnValueOnce(promise);

    const { result } = renderHook(() => useGameResults());

    // Start submission
    act(() => {
      result.current.submitResults('test@example.com', 2);
    });

    // Should be submitting
    expect(result.current.isSubmitting).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePromise();
      await promise;
    });

    // Should no longer be submitting
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle errors without error message', async () => {
    // Mock API error without message
    submitGameResults.mockRejectedValueOnce(new Error());

    const { result } = renderHook(() => useGameResults());

    await act(async () => {
      await result.current.submitResults('test@example.com', 1);
    });

    expect(result.current.error).toBe('Failed to submit game results');
    expect(result.current.lastSubmission.status).toBe('error');
    expect(result.current.lastSubmission.error).toBe('Failed to submit game results');
  });

  it('should clear error state', async () => {
    // Mock API error
    submitGameResults.mockRejectedValueOnce(new Error('Test error'));

    const { result } = renderHook(() => useGameResults());

    // Create error state
    await act(async () => {
      await result.current.submitResults('test@example.com', 4);
    });

    expect(result.current.error).toBe('Test error');

    // Clear error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('should reset all state', async () => {
    // Mock successful API call
    submitGameResults.mockResolvedValueOnce();

    const { result } = renderHook(() => useGameResults());

    // Create some state
    await act(async () => {
      await result.current.submitResults('test@example.com', 6);
    });

    expect(result.current.lastSubmission).not.toBe(null);

    // Reset state
    act(() => {
      result.current.reset();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.lastSubmission).toBe(null);
  });

  it('should not throw unhandled exceptions', async () => {
    // Mock API error
    submitGameResults.mockRejectedValueOnce(new Error('Critical error'));

    const { result } = renderHook(() => useGameResults());

    // Should not throw despite internal error
    await act(async () => {
      await expect(
        result.current.submitResults('test@example.com', 2)
      ).resolves.toBeUndefined();
    });

    // Error should be captured in state
    expect(result.current.error).toBe('Critical error');
  });

  it('should handle multiple concurrent submissions', async () => {
    // Mock API calls
    submitGameResults
      .mockResolvedValueOnce() // First call succeeds
      .mockRejectedValueOnce(new Error('Second call fails')); // Second call fails

    const { result } = renderHook(() => useGameResults());

    // Start two submissions concurrently
    await act(async () => {
      const promise1 = result.current.submitResults('test1@example.com', 3);
      const promise2 = result.current.submitResults('test2@example.com', 4);
      
      await Promise.all([promise1, promise2]);
    });

    // Should handle both calls
    expect(submitGameResults).toHaveBeenCalledTimes(2);
    expect(result.current.isSubmitting).toBe(false);
    
    // Last submission should reflect the second call (which failed)
    expect(result.current.lastSubmission.status).toBe('error');
    expect(result.current.error).toBe('Second call fails');
  });
});