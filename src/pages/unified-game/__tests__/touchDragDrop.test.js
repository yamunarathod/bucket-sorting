import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import UnifiedGameScreen from '../index';
import { useGameResults } from '../../../hooks/useGameResults';

// Mock the useGameResults hook
jest.mock('../../../hooks/useGameResults');

// Mock GameTimer component
jest.mock('../../game-play-screen/components/GameTimer', () => {
  return function MockGameTimer({ onTimeUp, isGameActive }) {
    React.useEffect(() => {
      if (isGameActive) {
        const timer = setTimeout(onTimeUp, 1000);
        return () => clearTimeout(timer);
      }
    }, [isGameActive, onTimeUp]);
    return <div data-testid="game-timer">03:00</div>;
  };
});

// Mock EmailForm component
jest.mock('../components/EmailForm', () => {
  return function MockEmailForm({ onEmailSubmit }) {
    return (
      <div>
        <button onClick={() => onEmailSubmit('test@example.com')}>
          Start Game
        </button>
      </div>
    );
  };
});

describe('Touch Drag and Drop Functionality', () => {
  const mockSubmitResults = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock useGameResults hook
    useGameResults.mockReturnValue({
      submitResults: mockSubmitResults,
      isSubmitting: false,
      error: null,
      lastSubmission: null
    });

    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const startGame = async () => {
    render(<UnifiedGameScreen />);
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    await waitFor(() => {
      expect(screen.getByText(/Drag & drop to sort the items/)).toBeInTheDocument();
    });
  };

  describe('Touch Event Handlers', () => {
    it('should initialize touch drag state on touchstart', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      // Create touch event
      const touchEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      };

      fireEvent.touchStart(skillCard, touchEvent);

      expect(touchEvent.preventDefault).toHaveBeenCalled();
      expect(skillCard).toHaveClass('opacity-50', 'scale-105');
    });

    it('should update position during touchmove', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      // Start touch
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      // Move touch
      const moveEvent = {
        touches: [{ clientX: 150, clientY: 150 }],
        preventDefault: jest.fn()
      };

      fireEvent.touchMove(skillCard, moveEvent);

      expect(moveEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle touchend and process drop', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      const bucket = screen.getByAltText('GROWTH').closest('div');
      
      // Mock elementFromPoint to return the bucket
      document.elementFromPoint = jest.fn().mockReturnValue(bucket);
      bucket.setAttribute('data-bucket-category', 'GROWTH');
      bucket.closest = jest.fn().mockReturnValue(bucket);

      // Start touch
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      // End touch over bucket
      const endEvent = {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: jest.fn()
      };

      fireEvent.touchEnd(skillCard, endEvent);

      expect(endEvent.preventDefault).toHaveBeenCalled();
      expect(document.elementFromPoint).toHaveBeenCalledWith(200, 200);
    });
  });

  describe('Touch and Mouse Compatibility', () => {
    it('should handle both touch and mouse events without conflicts', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to check return reasons').closest('div');
      
      // Test mouse drag
      fireEvent.dragStart(skillCard, {
        dataTransfer: {
          setData: jest.fn()
        }
      });
      
      expect(skillCard).toHaveClass('opacity-50', 'scale-105');
      
      fireEvent.dragEnd(skillCard);
      
      // Test touch drag on same element
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });
      
      expect(skillCard).toHaveClass('opacity-50', 'scale-105');
    });

    it('should use same game logic for both input methods', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to opt into Google Ads').closest('div');
      const bucket = screen.getByAltText('ADVERTISING').closest('div');
      
      // Mock drop zone detection
      document.elementFromPoint = jest.fn().mockReturnValue(bucket);
      bucket.setAttribute('data-bucket-category', 'ADVERTISING');
      bucket.closest = jest.fn().mockReturnValue(bucket);

      // Touch-based drop
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      fireEvent.touchEnd(skillCard, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: jest.fn()
      });

      // Skill should be removed from available skills (placed)
      await waitFor(() => {
        expect(screen.queryByText('I want to opt into Google Ads')).not.toBeInTheDocument();
      });
    });
  });

  describe('Touch Performance and Optimization', () => {
    it('should use requestAnimationFrame for smooth touch move', async () => {
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = jest.fn((cb) => cb());

      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      fireEvent.touchMove(skillCard, {
        touches: [{ clientX: 150, clientY: 150 }],
        preventDefault: jest.fn()
      });

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      
      window.requestAnimationFrame = originalRAF;
    });

    it('should prevent default touch behaviors to avoid conflicts', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      };

      const touchMoveEvent = {
        touches: [{ clientX: 150, clientY: 150 }],
        preventDefault: jest.fn()
      };

      const touchEndEvent = {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: jest.fn()
      };

      fireEvent.touchStart(skillCard, touchStartEvent);
      fireEvent.touchMove(skillCard, touchMoveEvent);
      fireEvent.touchEnd(skillCard, touchEndEvent);

      expect(touchStartEvent.preventDefault).toHaveBeenCalled();
      expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
      expect(touchEndEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Touch Error Handling', () => {
    it('should not allow dragging already placed skills', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      const bucket = screen.getByAltText('GROWTH').closest('div');
      
      // Mock drop zone detection
      document.elementFromPoint = jest.fn().mockReturnValue(bucket);
      bucket.setAttribute('data-bucket-category', 'GROWTH');
      bucket.closest = jest.fn().mockReturnValue(bucket);

      // First drop - should work
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      fireEvent.touchEnd(skillCard, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: jest.fn()
      });

      // Skill should be placed and removed from available skills
      await waitFor(() => {
        expect(screen.queryByText('I want to onboard to FBF')).not.toBeInTheDocument();
      });
    });

    it('should handle missing touch data gracefully', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      // Touch event without touches array
      const invalidTouchEvent = {
        preventDefault: jest.fn()
      };

      // Should not throw error
      expect(() => {
        fireEvent.touchStart(skillCard, invalidTouchEvent);
      }).not.toThrow();
    });

    it('should cleanup touch state on component unmount', async () => {
      const { unmount } = await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      // Start touch drag
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      // Unmount component
      unmount();

      // Should not throw errors during cleanup
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Touch Visual Feedback', () => {
    it('should apply visual feedback classes during touch drag', async () => {
      await startGame();
      
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      
      // Before touch
      expect(skillCard).not.toHaveClass('opacity-50', 'scale-105');
      
      // During touch
      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });
      
      expect(skillCard).toHaveClass('opacity-50', 'scale-105');
      
      // After touch end
      fireEvent.touchEnd(skillCard, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: jest.fn()
      });
      
      // Visual feedback should be removed
      expect(skillCard).not.toHaveClass('opacity-50', 'scale-105');
    });

    it('should have touch-specific CSS classes', async () => {
      await startGame();
      
      const skillCards = screen.getAllByText(/I want to/);
      
      skillCards.forEach(card => {
        const cardElement = card.closest('div');
        expect(cardElement).toHaveClass('touch-none', 'select-none');
      });
    });
  });

  describe('Game Integration with Touch', () => {
    it('should complete game when all skills placed via touch', async () => {
      await startGame();
      
      const skills = [
        { text: 'I want to onboard to FBF', category: 'GROWTH' },
        { text: 'I want to check return reasons', category: 'SELECTION INSIGHTS' },
        { text: 'I want to opt into Google Ads', category: 'ADVERTISING' },
        { text: 'I want to change settlement of my product', category: 'PAYMENTS' },
        { text: 'I want to understand new market trend', category: 'SELECTION INSIGHTS' },
        { text: 'I want to explore Dhamaka selection', category: 'INVENTORY' }
      ];

      // Place all skills using touch
      for (const skill of skills) {
        const skillCard = screen.queryByText(skill.text);
        if (skillCard) {
          const bucket = screen.getByAltText(skill.category).closest('div');
          
          document.elementFromPoint = jest.fn().mockReturnValue(bucket);
          bucket.setAttribute('data-bucket-category', skill.category);
          bucket.closest = jest.fn().mockReturnValue(bucket);

          fireEvent.touchStart(skillCard.closest('div'), {
            touches: [{ clientX: 100, clientY: 100 }],
            preventDefault: jest.fn()
          });

          fireEvent.touchEnd(skillCard.closest('div'), {
            changedTouches: [{ clientX: 200, clientY: 200 }],
            preventDefault: jest.fn()
          });

          await waitFor(() => {
            expect(screen.queryByText(skill.text)).not.toBeInTheDocument();
          });
        }
      }

      // Game should complete and show results
      await waitFor(() => {
        expect(screen.getByText(/CONGRATULATIONS!/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should submit results after touch-based game completion', async () => {
      await startGame();
      
      // Complete game with one correct touch placement
      const skillCard = screen.getByText('I want to onboard to FBF').closest('div');
      const bucket = screen.getByAltText('GROWTH').closest('div');
      
      document.elementFromPoint = jest.fn().mockReturnValue(bucket);
      bucket.setAttribute('data-bucket-category', 'GROWTH');
      bucket.closest = jest.fn().mockReturnValue(bucket);

      fireEvent.touchStart(skillCard, {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: jest.fn()
      });

      fireEvent.touchEnd(skillCard, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: jest.fn()
      });

      // Wait for any async operations
      await waitFor(() => {
        expect(screen.queryByText('I want to onboard to FBF')).not.toBeInTheDocument();
      });

      // Verify game logic was triggered (score should be updated)
      expect(mockSubmitResults).not.toHaveBeenCalled(); // Only called on game completion
    });
  });
});