import React, { useState, useEffect, useRef } from 'react';
import SkillBubble from './SkillBubble';

const GamePlayArea = ({ 
  skills, 
  onSkillPlaced, 
  placedSkills, 
  draggedSkillId, 
  onDragStart, 
  onDragEnd 
}) => {
  const [bubblePositions, setBubblePositions] = useState({});
  const playAreaRef = useRef(null);

  // Initialize random positions for bubbles
  useEffect(() => {
    if (skills.length > 0 && Object.keys(bubblePositions).length === 0) {
      const positions = {};
      const playArea = playAreaRef.current;
      
      if (playArea) {
        const areaWidth = playArea.clientWidth - 120; // Account for bubble width
        const areaHeight = playArea.clientHeight - 60; // Account for bubble height
        
        skills.forEach((skill) => {
          // Ensure bubbles don't overlap too much
          let attempts = 0;
          let position;
          
          do {
            position = {
              x: Math.random() * Math.max(areaWidth, 200),
              y: Math.random() * Math.max(areaHeight, 200)
            };
            attempts++;
          } while (attempts < 10); // Prevent infinite loop
          
          positions[skill.id] = position;
        });
        
        setBubblePositions(positions);
      }
    }
  }, [skills, bubblePositions]);

  // Reposition bubbles when window resizes
  useEffect(() => {
    const handleResize = () => {
      setBubblePositions({});
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={playAreaRef}
      className="relative flex-1 overflow-hidden bg-gradient-to-br from-background to-muted/30 rounded-lg"
      style={{ minHeight: '400px' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-primary) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, var(--color-secondary) 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Game Instructions Overlay */}
      {skills.length > 0 && Object.keys(placedSkills).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-6 shadow-game-hover max-w-md text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Drag & Drop Skills
            </h3>
            <p className="text-sm text-text-secondary">
              Drag the skill bubbles to their appropriate category buckets below. 
              You have 3 minutes to categorize all skills correctly!
            </p>
          </div>
        </div>
      )}

      {/* Skill Bubbles */}
      {skills.map((skill) => (
        <SkillBubble
          key={skill.id}
          skill={skill}
          position={bubblePositions[skill.id] || { x: 0, y: 0 }}
          isDragging={draggedSkillId === skill.id}
          isPlaced={placedSkills[skill.id]}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}

      {/* Success Animation Container */}
      <div id="success-animations" className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default GamePlayArea;