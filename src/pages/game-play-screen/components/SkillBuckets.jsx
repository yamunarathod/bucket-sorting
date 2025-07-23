import React from 'react';
import SkillBucket from './SkillBucket';

const SkillBuckets = ({ onSkillDrop, placedSkills, draggedSkillId }) => {
  const buckets = [
    { 
      category: 'Technical', 
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      darkBg: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-400',
      hoverBorder: 'hover:border-blue-500'
    },
    { 
      category: 'Creative', 
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      darkBg: 'bg-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-400',
      hoverBorder: 'hover:border-purple-500'
    },
    { 
      category: 'Leadership', 
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      darkBg: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-400',
      hoverBorder: 'hover:border-emerald-500'
    },
    { 
      category: 'Communication', 
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      darkBg: 'bg-orange-100',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-400',
      hoverBorder: 'hover:border-orange-500'
    },
    { 
      category: 'Analytical', 
      color: 'rose',
      bgColor: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      darkBg: 'bg-rose-100',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-400',
      hoverBorder: 'hover:border-rose-500'
    }
  ];

  const getPlacedSkillsForBucket = (category) => {
    return Object.values(placedSkills).filter(skill => 
      skill.placedIn === category
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border shadow-game-hover">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-center space-x-2 max-w-6xl mx-auto">
          {buckets.map((bucket) => (
            <SkillBucket
              key={bucket.category}
              category={bucket.category}
              bucketColors={bucket}
              onDrop={onSkillDrop}
              isHighlighted={draggedSkillId !== null}
              placedSkills={getPlacedSkillsForBucket(bucket.category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillBuckets;