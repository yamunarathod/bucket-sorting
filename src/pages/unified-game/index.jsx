import React, { useState, useEffect, useCallback } from 'react';
import EmailForm from './components/EmailForm';
import GameTimer from '../game-play-screen/components/GameTimer';

import { useGameResults } from '../../hooks/useGameResults';

const UnifiedGameScreen = () => {
  const [gamePhase, setGamePhase] = useState('email');
  const [playerEmail, setPlayerEmail] = useState('');
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [correctPlacements, setCorrectPlacements] = useState(0);
  const [placedSkills, setPlacedSkills] = useState({});
  const [draggedSkillId, setDraggedSkillId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [animatedBucketCategory, setAnimatedBucketCategory] = useState(null);
  const [finalWeightedScore, setFinalWeightedScore] = useState(0);

  // Touch drag state management
  const [touchDragState, setTouchDragState] = useState({
    isDragging: false,
    draggedSkill: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    draggedElement: null
  });

  // Initialize game results hook
  const { submitResults } = useGameResults();

  const skillsData = [
    { id: 1, skill: "I want to onboard to FBF", category: "INVENTORY" },
    { id: 2, skill: "I want to check return reasons", category: "GROWTH" },
    { id: 3, skill: "I want to opt into Google Ads", category: "ADVERTISING" },
    { id: 4, skill: "I want to change settlement of my product", category: "LISTINGS" },
    { id: 5, skill: "I want to understand new market trend", category: "GROWTH" },
    { id: 6, skill: "I want to explore Dhamaka selection", category: "SELECTION INSIGHTS" }
  ];
  const [skills] = useState(skillsData);

  // Calculate weighted score out of 10 (50% points, 50% time)
  const calculateFinalScore = useCallback((correctCount, timeLeft) => {
    const maxCorrect = skills.length; // 6 skills
    const maxTime = 60; // 3 minutes

    // Points component (50% weight, max 5 points)
    const pointsScore = (correctCount / maxCorrect) * 5;

    // Time component (50% weight, max 5 points)
    const timeScore = (timeLeft / maxTime) * 5;

    // Total score out of 10
    const finalScore = pointsScore + timeScore;

    return Math.round(finalScore * 100) / 100; // Round to 2 decimal places
  }, [skills.length]);

  const initialBuckets = [
    { category: 'GROWTH', image: '/assets/images/bucket-growth.png' },
    { category: 'SELECTION INSIGHTS', image: '/assets/images/bucket-selection.png' },
    { category: 'INVENTORY', image: '/assets/images/bucket-inventory.png' },
    { category: 'PAYMENTS', image: '/assets/images/bucket-payments.png' },
    { category: 'LISTINGS', image: '/assets/images/bucket-listings.png' },
    { category: 'ADVERTISING', image: '/assets/images/bucket-advertising.png' }
  ];

  const handleEmailSubmit = async (email) => {
    setPlayerEmail(email);
    setGamePhase('game');
    setIsGameActive(true);
    setGameStartTime(new Date());
    setTimeRemaining(60);
    localStorage.setItem('playerEmail', email);
    localStorage.setItem('gameStartTime', new Date().toISOString());
  };

  const handleTimeUp = useCallback(async () => {
    setIsGameActive(false);
    setGameEndTime(new Date());

    // Calculate final weighted score (50% points, 50% time)
    const calculatedScore = calculateFinalScore(correctPlacements, timeRemaining);
    setFinalWeightedScore(calculatedScore);

    // Submit game results to API (non-blocking with validation)
    try {
      if (playerEmail && playerEmail.trim() !== '' && typeof calculatedScore === 'number') {
        await submitResults(playerEmail, calculatedScore);
      } else {
        console.warn('Game results not submitted: missing or invalid data', {
          email: playerEmail,
          score: calculatedScore
        });
      }
    } catch (error) {
      // Error is already handled in the hook, but log for additional context
      console.error('Error during game completion API submission:', error);
    }

    setGamePhase('results');
  }, [playerEmail, correctPlacements, timeRemaining, calculateFinalScore, submitResults]);

  const handleDragStart = (skillId) => {
    setDraggedSkillId(skillId);
  };

  const handleDragEnd = () => {
    setDraggedSkillId(null);
  };

  const handleSkillDrop = (droppedSkill, targetCategory) => {
    if (placedSkills[droppedSkill.id]) return;
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
    }

    setAnimatedBucketCategory(targetCategory);
    setTimeout(() => setAnimatedBucketCategory(null), 500);

    const newPlacedCount = Object.keys(placedSkills).length + 1;
    if (newPlacedCount === skills.length) {
      setTimeout(async () => {
        setIsGameActive(false);
        setGameEndTime(new Date());

        // Calculate final weighted score when all skills are placed
        const finalCorrectCount = isCorrect ? correctPlacements + 1 : correctPlacements;
        const calculatedScore = calculateFinalScore(finalCorrectCount, timeRemaining);
        setFinalWeightedScore(calculatedScore);

        // Submit game results to API when all skills are placed (non-blocking with validation)
        try {
          if (playerEmail && playerEmail.trim() !== '') {
            if (typeof calculatedScore === 'number') {
              await submitResults(playerEmail, calculatedScore);
            } else {
              console.warn('Game results not submitted: invalid final score', {
                email: playerEmail,
                finalScore: calculatedScore
              });
            }
          } else {
            console.warn('Game results not submitted: missing or invalid email', {
              email: playerEmail
            });
          }
        } catch (error) {
          // Error is already handled in the hook, but log for additional context
          console.error('Error during all-skills-placed API submission:', error);
        }

        setGamePhase('results');
      }, 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBucketDrop = (e, category) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      handleSkillDrop(data, category);
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e, skill) => {
    // Prevent already placed skills from being dragged
    if (placedSkills[skill.id]) return;

    e.preventDefault(); // Prevent default touch behaviors
    e.stopPropagation(); // Prevent event bubbling

    const touch = e.touches[0];
    const element = e.currentTarget;

    // Add visual feedback immediately
    element.style.opacity = '0.5';
    element.style.transform = 'scale(1.05)';
    element.style.zIndex = '1000';

    setTouchDragState({
      isDragging: true,
      draggedSkill: skill,
      startPosition: { x: touch.clientX, y: touch.clientY },
      currentPosition: { x: touch.clientX, y: touch.clientY },
      draggedElement: element
    });

    // Set visual feedback similar to mouse drag
    setDraggedSkillId(skill.id);
  };

  const handleTouchMove = useCallback((e) => {
    if (!touchDragState.isDragging || !touchDragState.draggedElement) return;

    e.preventDefault(); // Prevent scrolling during drag
    e.stopPropagation(); // Prevent event bubbling

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchDragState.startPosition.x;
    const deltaY = touch.clientY - touchDragState.startPosition.y;

    // Update visual position immediately without requestAnimationFrame for better responsiveness
    touchDragState.draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    touchDragState.draggedElement.style.zIndex = '1000';
    touchDragState.draggedElement.style.pointerEvents = 'none';
    touchDragState.draggedElement.style.opacity = '0.8';

    // Update state for position tracking
    setTouchDragState(prev => ({
      ...prev,
      currentPosition: { x: touch.clientX, y: touch.clientY }
    }));
  }, [touchDragState.isDragging, touchDragState.draggedElement, touchDragState.startPosition]);

  const handleTouchEnd = (e) => {
    if (!touchDragState.isDragging || !touchDragState.draggedElement) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.changedTouches[0];
    if (!touch) {
      // Reset state if no touch data
      resetTouchState();
      return;
    }

    // Find element under touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const bucketElement = elementBelow?.closest('[data-bucket-category]');

    // Reset visual state immediately
    const element = touchDragState.draggedElement;
    element.style.transform = '';
    element.style.zIndex = '';
    element.style.pointerEvents = '';
    element.style.opacity = '';

    // Process drop if over a valid bucket
    if (bucketElement && touchDragState.draggedSkill) {
      const targetCategory = bucketElement.getAttribute('data-bucket-category');
      handleSkillDrop(touchDragState.draggedSkill, targetCategory);
    }

    // Reset touch drag state
    resetTouchState();
  };

  const resetTouchState = () => {
    setTouchDragState({
      isDragging: false,
      draggedSkill: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      draggedElement: null
    });
    setDraggedSkillId(null);
  };




  useEffect(() => {
    if (isGameActive) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameActive, handleTimeUp]);

  useEffect(() => {
    const titles = {
      email: 'Start Game - Flipkart Seller Hub Sorting Game',
      game: 'Playing - Flipkart Seller Hub Sorting Game',
      results: 'Results - Flipkart Seller Hub Sorting Game'
    };
    document.title = titles[gamePhase];
  }, [gamePhase]);

  // Auto-refresh the page after 5 seconds on result screen
  useEffect(() => {
    if (gamePhase === 'results') {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [gamePhase]);

  // Cleanup touch drag state on component unmount or game phase change
  useEffect(() => {
    return () => {
      if (touchDragState.draggedElement) {
        touchDragState.draggedElement.style.transform = '';
        touchDragState.draggedElement.style.zIndex = '';
        touchDragState.draggedElement.style.pointerEvents = '';
      }
    };
  }, [gamePhase, touchDragState.draggedElement]);

  return (
    <div className="h-screen bg-background">
      {gamePhase === 'email' && (
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-8 px-4">
            <EmailForm onEmailSubmit={handleEmailSubmit} />
          </div>
        </main>
      )}

      {gamePhase === 'game' && (
        <main
          className="h-screen w-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center pt-[320px] px-4"
          style={{ backgroundImage: "url('/assets/images/s2.png')" }}
        >
          <h2 className="text-[60px] font-bold text-[#00B5DB] text-center mb-16">
            Drag & drop to sort the items<br />into their respective buckets
          </h2>
          <div className="grid grid-cols-3 gap-6 mb-20">
            {skills.map(skill => !placedSkills[skill.id] && (
              <div
                key={skill.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify(skill));
                  handleDragStart(skill.id);
                }}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, skill)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`
                  p-[2px] rounded-lg bg-gradient-to-r from-[#4216EF] to-[#11BBDE]
                  cursor-grab active:cursor-grabbing hover:scale-105 transition
                  ${draggedSkillId === skill.id ? 'opacity-50 scale-105' : ''}
                  touch-none select-none
                `}
              >
                <div className="text-center text-[14px] font-medium py-4 px-3 bg-white rounded-md shadow-sm">
                  {skill.skill}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-24">
            {initialBuckets.map(bucket => (
              <div
                key={bucket.category}
                data-bucket-category={bucket.category}
                onDragOver={handleDragOver}
                onDrop={(e) => handleBucketDrop(e, bucket.category)}
                className="relative flex flex-col items-center justify-center"
              >
                <img
                  src={bucket.image}
                  alt={bucket.category}
                  className={`w-[230px] h-auto transition-transform duration-500 ease-out ${animatedBucketCategory === bucket.category ? 'animate-bucket-receive' : ''
                    }`}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-20 left-0 w-full flex justify-center">
            <div className="text-white text-5xl font-bold px-16 py-5 rounded-full">
              <GameTimer onTimeUp={handleTimeUp} isGameActive={isGameActive} />
            </div>
          </div>
        </main>
      )}

      {gamePhase === 'results' && (
        <main
          className="min-h-screen w-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center"
          style={{
            backgroundImage: finalWeightedScore === 0 ? "url('/assets/images/s4.png')" : "url('/assets/images/s3.png')"
          }}
        >
          {finalWeightedScore > 0 && (
            <div className="flex flex-col items-center justify-center text-center px-6 pt-[1241px]">
              <h1 className="text-[72px] font-bold text-white mb-4">CONGRATULATIONS!</h1>
              <p className="text-[64px] text-white mb-2">Your Score</p>
              <div className="text-[74px] font-bold text-white">
                {finalWeightedScore}/10
              </div>
              <p className="text-[48px] text-white mt-2">
                ({correctPlacements}/{skills.length} Correct • Time Bonus Included)
              </p>
            </div>
          )}
        </main>
      )}

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/assets/images/s2_1_-1753266858291.png"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
    </div>
  );
};

export default UnifiedGameScreen;
