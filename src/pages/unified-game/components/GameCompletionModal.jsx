import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameCompletionModal = ({
  isVisible,
  score,
  totalSkills,
  correctPlacements,
  timeRemaining,
  onPlayAgain,
  onViewResults
}) => {
  if (!isVisible) return null;

  const accuracy = Math.round((correctPlacements / totalSkills) * 100);
  const timeBonus = Math.floor(timeRemaining / 10);
  const finalScore = score + timeBonus;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Outstanding Performance! 🌟";
    if (accuracy >= 75) return "Great Job! 👏";
    if (accuracy >= 60) return "Good Effort! 👍";
    return "Keep Practicing! 💪";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 90) return "text-success";
    if (accuracy >= 75) return "text-primary";
    if (accuracy >= 60) return "text-warning";
    return "text-error";
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="min-h-screen flex flex-col">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
          <Icon name="Trophy" size={64} className="text-primary-foreground mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            Game Complete!
          </h1>
          <p className={`text-2xl font-semibold ${getPerformanceColor()}`}>
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-8 bg-surface rounded-2xl shadow-game-active">
                <div className="text-5xl font-bold text-primary mb-2">{finalScore}</div>
                <div className="text-lg text-text-secondary">Final Score</div>
              </div>
              <div className="text-center p-8 bg-surface rounded-2xl shadow-game-active">
                <div className="text-5xl font-bold text-success mb-2">{accuracy}%</div>
                <div className="text-lg text-text-secondary">Accuracy</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-surface rounded-2xl shadow-game-active p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Game Summary</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-success">{correctPlacements}</div>
                    <div className="text-sm text-text-secondary">Correct Placements</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-error">{totalSkills - correctPlacements}</div>
                    <div className="text-sm text-text-secondary">Incorrect Placements</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-accent">+{timeBonus}</div>
                    <div className="text-sm text-text-secondary">Time Bonus</div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-text-secondary">Base Score:</span>
                    <span className="font-semibold">{score}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-text-secondary">Time Bonus:</span>
                    <span className="font-semibold text-accent">+{timeBonus}</span>
                  </div>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold">Total Score:</span>
                      <span className="text-2xl font-bold text-primary">{finalScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                variant="default"
                fullWidth
                onClick={onViewResults}
                iconName="BarChart3"
                iconPosition="left"
                className="hover-lift py-4 text-lg"
              >
                View Detailed Results
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={onPlayAgain}
                  iconName="RotateCcw"
                  iconPosition="left"
                  className="hover-lift py-3"
                >
                  Play Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={onPlayAgain}
                  iconName="Home"
                  iconPosition="left"
                  className="hover-lift py-3"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-border">
          <p className="text-text-secondary">
            Thank you for playing! 🎮
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCompletionModal;