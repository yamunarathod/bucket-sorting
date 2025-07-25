import { submitGameResults, formatGameResultsPayload, validateGameData } from '../gameResultsApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('gameResultsApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatGameResultsPayload', () => {
    it('should format payload with correct structure', () => {
      const email = 'test@example.com';
      const score = 5;
      
      const result = formatGameResultsPayload(email, score);
      
      expect(result).toEqual({
        email: 'test@example.com',
        element_id: '04',
        game_name: 'MCQ',
        location: 'surat',
        score: 5
      });
    });

    it('should handle different email formats', () => {
      const emails = ['user@domain.com', 'test.user+tag@example.org', 'simple@test.co'];
      
      emails.forEach(email => {
        const result = formatGameResultsPayload(email, 3);
        expect(result.email).toBe(email);
        expect(result.element_id).toBe('04');
        expect(result.game_name).toBe('MCQ');
        expect(result.location).toBe('surat');
        expect(result.score).toBe(3);
      });
    });

    it('should handle different score values', () => {
      const scores = [0, 1, 3, 6, 10];
      
      scores.forEach(score => {
        const result = formatGameResultsPayload('test@example.com', score);
        expect(result.score).toBe(score);
        expect(result.email).toBe('test@example.com');
      });
    });
  });

  describe('validateGameData', () => {
    it('should pass validation with valid data', () => {
      expect(() => validateGameData('test@example.com', 5)).not.toThrow();
      expect(() => validateGameData('user@domain.org', 0)).not.toThrow();
      expect(() => validateGameData('valid@email.co', 6)).not.toThrow();
    });

    it('should throw error for invalid email', () => {
      expect(() => validateGameData('', 5)).toThrow('Valid email is required');
      expect(() => validateGameData(null, 5)).toThrow('Valid email is required');
      expect(() => validateGameData(undefined, 5)).toThrow('Valid email is required');
      expect(() => validateGameData('   ', 5)).toThrow('Valid email is required');
      expect(() => validateGameData(123, 5)).toThrow('Valid email is required');
    });

    it('should throw error for invalid score', () => {
      expect(() => validateGameData('test@example.com', -1)).toThrow('Valid score is required');
      expect(() => validateGameData('test@example.com', 'invalid')).toThrow('Valid score is required');
      expect(() => validateGameData('test@example.com', null)).toThrow('Valid score is required');
      expect(() => validateGameData('test@example.com', undefined)).toThrow('Valid score is required');
    });
  });

  describe('submitGameResults', () => {
    it('should successfully submit valid game results', async () => {
      // Mock successful fetch response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      await submitGameResults('test@example.com', 5);

      expect(fetch).toHaveBeenCalledWith(
        'https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            element_id: '04',
            game_name: 'MCQ',
            location: 'surat',
            score: 5
          })
        })
      );

      expect(console.log).toHaveBeenCalledWith(
        'Game results submitted successfully:',
        expect.objectContaining({
          email: 'test@example.com',
          score: 5
        })
      );
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await submitGameResults('test@example.com', 3);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to submit game results:',
        'Network error'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Payload that failed:',
        { email: 'test@example.com', score: 3 }
      );
    });

    it('should handle HTTP error responses', async () => {
      // Mock HTTP error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await submitGameResults('test@example.com', 2);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to submit game results:',
        'HTTP error! status: 500'
      );
    });

    it('should handle timeout errors', async () => {
      // Mock timeout by rejecting after delay
      fetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await submitGameResults('test@example.com', 4);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to submit game results:',
        'Request timeout'
      );
    });

    it('should handle validation errors', async () => {
      await submitGameResults('', 5);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to submit game results:',
        'Valid email is required'
      );
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should not throw errors to calling code', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      // Should not throw despite internal error
      await expect(submitGameResults('test@example.com', 1)).resolves.toBeUndefined();
    });
  });
});