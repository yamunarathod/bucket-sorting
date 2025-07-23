import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreDisplay = ({ score, totalBubbles, correctPlacements }) => {
  return (
    <div className="flex items-center justify-center space-x-3 bg-surface rounded-lg px-4 py-2 shadow-game-resting">
      <Icon name="Trophy" size={20} className="text-accent" />
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-text-primary">
          {score}
        </span>
        <span className="text-xs text-text-secondary font-medium">
          Score
        </span>
      </div>
      <div className="w-px h-8 bg-border mx-2" />
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium text-success">
          {correctPlacements}
        </span>
        <span className="text-xs text-text-secondary">
          Correct
        </span>
      </div>
    </div>
  );
};

export default ScoreDisplay;