import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GameHeader from './components/GameHeader';
import GamePlayArea from './components/GamePlayArea';
import SkillBuckets from './components/SkillBuckets';
import GameCompletionModal from './components/GameCompletionModal';

const GamePlayScreen = () => {
  const navigate = useNavigate();
  
  // Game state
  const [isGameActive, setIsGameActive] = useState(true);
  const [score, setScore] = useState(0);
  const [correctPlacements, setCorrectPlacements] = useState(0);
  const [placedSkills, setPlacedSkills] = useState({});
  const [draggedSkillId, setDraggedSkillId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);

  // Mock skill data with correct categories
  const skillsData = [
    { id: 1, skill: "JavaScript", category: "Technical" },
    { id: 2, skill: "React", category: "Technical" },
    { id: 3, skill: "Python", category: "Technical" },
    { id: 4, skill: "SQL", category: "Technical" },
    { id: 5, skill: "Git", category: "Technical" },
    { id: 6, skill: "Graphic Design", category: "Creative" },
    { id: 7, skill: "UI/UX Design", category: "Creative" },
    { id: 8, skill: "Photography", category: "Creative" },
    { id: 9, skill: "Content Writing", category: "Creative" },
    { id: 10, skill: "Video Editing", category: "Creative" },
    { id: 11, skill: "Team Management", category: "Leadership" },
    { id: 12, skill: "Project Planning", category: "Leadership" },
    { id: 13, skill: "Mentoring", category: "Leadership" },
    { id: 14, skill: "Strategic Thinking", category: "Leadership" },
    { id: 15, skill: "Decision Making", category: "Leadership" },
    { id: 16, skill: "Public Speaking", category: "Communication" },
    { id: 17, skill: "Technical Writing", category: "Communication" },
    { id: 18, skill: "Presentation Skills", category: "Communication" },
    { id: 19, skill: "Active Listening", category: "Communication" },
    { id: 20, skill: "Negotiation", category: "Communication" },
    { id: 21, skill: "Data Analysis", category: "Analytical" },
    { id: 22, skill: "Problem Solving", category: "Analytical" },
    { id: 23, skill: "Research", category: "Analytical" },
    { id: 24, skill: "Critical Thinking", category: "Analytical" },
    { id: 25, skill: "Statistical Analysis", category: "Analytical" }
  ];

  const [skills] = useState(skillsData);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setIsGameActive(false);
    setShowCompletionModal(true);
  }, []);

  // Handle skill drag start
  const handleDragStart = (skillId) => {
    setDraggedSkillId(skillId);
  };

  // Handle skill drag end
  const handleDragEnd = () => {
    setDraggedSkillId(null);
  };

  // Handle skill drop
  const handleSkillDrop = (droppedSkill, targetCategory) => {
    if (placedSkills[droppedSkill.id]) return; // Already placed

    const isCorrect = droppedSkill.category === targetCategory;
    
    setPlacedSkills(prev => ({
      ...prev,
      [droppedSkill.id]: {
        ...droppedSkill,
        placedIn: targetCategory,
        isCorrect
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCorrectPlacements(prev => prev + 1);
      
      // Success animation
      showSuccessAnimation();
    } else {
      // Error animation
      showErrorAnimation();
    }

    // Check if game is complete
    const newPlacedCount = Object.keys(placedSkills).length + 1;
    if (newPlacedCount === skills.length) {
      setTimeout(() => {
        setIsGameActive(false);
        setShowCompletionModal(true);
      }, 500);
    }
  };

  // Success animation
  const showSuccessAnimation = () => {
    const container = document.getElementById('success-animations');
    if (container) {
      const animation = document.createElement('div');
      animation.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-success text-2xl font-bold animate-bounce pointer-events-none';
      animation.textContent = '+1';
      container.appendChild(animation);
      
      setTimeout(() => {
        container.removeChild(animation);
      }, 1000);
    }
  };

  // Error animation
  const showErrorAnimation = () => {
    const container = document.getElementById('success-animations');
    if (container) {
      const animation = document.createElement('div');
      animation.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-error text-xl font-bold animate-pulse pointer-events-none';
      animation.textContent = 'Try Again!';
      container.appendChild(animation);
      
      setTimeout(() => {
        container.removeChild(animation);
      }, 1000);
    }
  };

  // Handle play again
  const handlePlayAgain = () => {
    setIsGameActive(true);
    setScore(0);
    setCorrectPlacements(0);
    setPlacedSkills({});
    setDraggedSkillId(null);
    setShowCompletionModal(false);
    setTimeRemaining(180);
  };

  // Update time remaining for modal
  useEffect(() => {
    if (isGameActive) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isGameActive]);

  const remainingBubbles = skills.length - Object.keys(placedSkills).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <GameHeader
        onTimeUp={handleTimeUp}
        isGameActive={isGameActive}
        score={score}
        totalBubbles={skills.length}
        remainingBubbles={remainingBubbles}
        correctPlacements={correctPlacements}
      />

      <main className="pt-32 pb-32 px-4">
        <div className="max-w-6xl mx-auto h-full">
          <GamePlayArea
            skills={skills}
            onSkillPlaced={handleSkillDrop}
            placedSkills={placedSkills}
            draggedSkillId={draggedSkillId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>
      </main>

      <SkillBuckets
        onSkillDrop={handleSkillDrop}
        placedSkills={placedSkills}
        draggedSkillId={draggedSkillId}
      />

      <GameCompletionModal
        isVisible={showCompletionModal}
        score={score}
        totalSkills={skills.length}
        correctPlacements={correctPlacements}
        timeRemaining={timeRemaining}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
};

export default GamePlayScreen;