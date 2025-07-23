import React from 'react';
import Icon from '../../../components/AppIcon';

const BubbleCounter = ({ remaining, total }) => {
  const progressPercentage = ((total - remaining) / total) * 100;

  return (
    <div className="flex items-center justify-center space-x-3 bg-surface rounded-lg px-4 py-2 shadow-game-resting">
      <Icon name="Circle" size={20} className="text-secondary" />
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-text-primary">
          {remaining}
        </span>
        <span className="text-xs text-text-secondary font-medium">
          Left
        </span>
      </div>
      <div className="flex flex-col items-center ml-2">
        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs text-text-secondary mt-1">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default BubbleCounter;