import React, { useState } from 'react';

const SkillBubble = ({ 
  skill, 
  onDragStart, 
  onDragEnd, 
  isDragging, 
  position,
  isPlaced 
}) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
    
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: skill.id,
      skill: skill.skill,
      category: skill.category
    }));
    
    onDragStart(skill.id);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  if (isPlaced) return null;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`absolute select-none cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105 z-50' : 'hover:scale-105 hover-lift'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)'
      }}
    >
      <div className={`
        px-4 py-2 rounded-full text-sm font-medium shadow-game-resting
        bg-gradient-to-r from-primary to-secondary text-primary-foreground
        border-2 border-transparent hover:border-accent
        transition-all duration-200 whitespace-nowrap
        ${isDragging ? 'shadow-game-active' : 'shadow-game-hover'}
      `}>
        {skill.skill}
      </div>
    </div>
  );
};

export default SkillBubble;