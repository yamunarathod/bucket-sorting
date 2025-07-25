import { useState, useCallback } from 'react';
import { submitGameResults } from '../services/gameResultsApi';

/**
 * Custom hook for managing game results submission
 * Provides state management and error handling for API submissions
 * @returns {Object} Hook interface with submitResults function and state
 */
export const useGameResults = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);

  /**
   * Submits game results to the API
   * @param {string} email - Player's email address
   * @param {number} score - Player's final score
   * @returns {Promise<void>}
   */
  const submitResults = useCallback(async (email, score) => {
    // Reset previous error state
    setError(null);
    setIsSubmitting(true);

    try {
      await submitGameResults(email, score);
      
      // Track successful submission for debugging
      setLastSubmission({
        email,
        score,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
      
    } catch (err) {
      // Set error state but don't throw to prevent crashes
      const errorMessage = err.message || 'Failed to submit game results';
      setError(errorMessage);
      
      // Track failed submission for debugging
      setLastSubmission({
        email,
        score,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: errorMessage
      });
      
      // Log error for debugging but don't expose to user
      console.error('Game results submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  /**
   * Resets the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resets all state to initial values
   */
  const reset = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
    setLastSubmission(null);
  }, []);

  return {
    submitResults,
    isSubmitting,
    error,
    lastSubmission,
    clearError,
    reset
  };
};