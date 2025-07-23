import React from 'react';
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import BubbleCounter from './BubbleCounter';

const GameHeader = ({ 
  onTimeUp, 
  isGameActive, 
  score, 
  totalBubbles, 
  remainingBubbles, 
  correctPlacements 
}) => {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Score Display - Left */}
          <div className="flex-1 flex justify-start">
            <ScoreDisplay 
              score={score}
              totalBubbles={totalBubbles}
              correctPlacements={correctPlacements}
            />
          </div>

          {/* Timer - Center */}
          <div className="flex-1 flex justify-center">
            <GameTimer 
              onTimeUp={onTimeUp}
              isGameActive={isGameActive}
            />
          </div>

          {/* Bubble Counter - Right */}
          <div className="flex-1 flex justify-end">
            <BubbleCounter 
              remaining={remainingBubbles}
              total={totalBubbles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;