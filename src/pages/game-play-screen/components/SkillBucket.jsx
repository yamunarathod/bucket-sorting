import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SkillBucket = ({ 
  category, 
  onDrop, 
  isHighlighted, 
  placedSkills = [],
  bucketColors 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      onDrop(data, category);
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };

  const getBucketIcon = () => {
    switch (category.toLowerCase()) {
      case 'technical': return 'Code';
      case 'creative': return 'Palette';
      case 'leadership': return 'Users';
      case 'communication': return 'MessageCircle';
      case 'analytical': return 'BarChart3';
      default: return 'Folder';
    }
  };

  const hasItems = placedSkills.length > 0;
  
  // Dynamic classes based on state
  const getContainerClasses = () => {
    let baseClasses = "relative flex-1 min-h-24 max-w-48 rounded-xl border-2 transition-all duration-300 ease-out";
    
    if (isDragOver) {
      return `${baseClasses} ${bucketColors.borderColor} ${bucketColors.darkBg} scale-105 shadow-game-hover border-solid`;
    } else if (isHighlighted) {
      return `${baseClasses} ${bucketColors.borderColor} ${bucketColors.lightBg} border-dashed ${bucketColors.hoverBorder}`;
    } else if (hasItems) {
      return `${baseClasses} ${bucketColors.borderColor} ${bucketColors.lightBg} border-solid shadow-game-resting`;
    } else {
      return `${baseClasses} border-border bg-surface hover:border-muted-foreground/30 border-dashed`;
    }
  };

  const getHeaderClasses = () => {
    if (isDragOver || hasItems) {
      return `${bucketColors.textColor} font-semibold`;
    }
    return 'text-text-primary font-semibold';
  };

  const getIconClasses = () => {
    if (isDragOver || hasItems) {
      return bucketColors.textColor;
    }
    return 'text-text-secondary';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={getContainerClasses()}
    >
      {/* Header */}
      <div className="flex items-center justify-center p-3 border-b border-border/50">
        <Icon 
          name={getBucketIcon()} 
          size={18} 
          className={`mr-2 ${getIconClasses()}`}
        />
        <span className={`text-sm ${getHeaderClasses()}`}>
          {category}
        </span>
        {placedSkills.length > 0 && (
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${bucketColors.bgColor} text-white font-medium`}>
            {placedSkills.length}
          </span>
        )}
      </div>

      {/* Drop Zone */}
      <div className="flex-1 p-3 min-h-16">
        {placedSkills.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className={`text-xs text-center ${
              isDragOver ? bucketColors.textColor : 'text-text-secondary'
            }`}>
              Drop skills here
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            {placedSkills.slice(0, 3).map((skill, index) => (
              <div
                key={skill.id}
                className={`px-2 py-1 rounded text-xs ${bucketColors.darkBg} ${bucketColors.textColor} font-medium truncate`}
              >
                {skill.skill}
              </div>
            ))}
            {placedSkills.length > 3 && (
              <div className={`text-xs text-center ${bucketColors.textColor}`}>
                +{placedSkills.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Drag Over Indicator */}
      {isDragOver && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-white/5 pointer-events-none">
          <div className={`absolute inset-2 rounded-lg border-2 ${bucketColors.borderColor} border-solid animate-pulse shadow-lg`} />
        </div>
      )}

      {/* Success glow effect when items are placed */}
      {hasItems && !isDragOver && (
        <div className={`absolute inset-0 rounded-xl ${bucketColors.lightBg} opacity-50 pointer-events-none`} />
      )}
    </div>
  );
};

export default SkillBucket;