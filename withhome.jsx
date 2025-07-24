import React, { useState, useEffect, useCallback } from 'react';
import EmailForm from './components/EmailForm';
import GameTimer from '../game-play-screen/components/GameTimer';
import ActionButtons from './components/ActionButtons';

const UnifiedGameScreen = () => {
  // Game phase states: 'email', 'game', 'results'
  const [gamePhase, setGamePhase] = useState('email');
  const [playerEmail, setPlayerEmail] = useState('');

  // Game state
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [correctPlacements, setCorrectPlacements] = useState(0);
  const [placedSkills, setPlacedSkills] = useState({});
  const [draggedSkillId, setDraggedSkillId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);

  // State to control bucket animation
  const [animatedBucketCategory, setAnimatedBucketCategory] = useState(null);

  // Skills data
  const skillsData = [
    { id: 1, skill: "I want to onboard to FBF", category: "GROWTH" },
    { id: 2, skill: "I want to check return reasons", category: "SELECTION INSIGHTS" },
    { id: 3, skill: "I want to opt into Google Ads", category: "ADVERTISING" },
    { id: 4, skill: "I want to change settlement of my product", category: "PAYMENTS" },
    { id: 5, skill: "I want to understand new market trend", category: "SELECTION INSIGHTS" },
    { id: 6, skill: "I want to explore Dhamaka selection", category: "INVENTORY" }
  ];

  const [skills] = useState(skillsData);

  // Initial bucket configuration - these images will remain static
  const initialBuckets = [
    {
      category: 'GROWTH',
      image: '/assets/images/bucket-growth.png',
    },
    {
      category: 'SELECTION INSIGHTS',
      image: '/assets/images/bucket-selection.png',
    },
    {
      category: 'INVENTORY',
      image: '/assets/images/bucket-inventory.png',
    },
    {
      category: 'PAYMENTS',
      image: '/assets/images/bucket-payments.png',
    },
    {
      category: 'LISTINGS',
      image: '/assets/images/bucket-listings.png',
    },
    {
      category: 'ADVERTISING',
      image: '/assets/images/bucket-advertising.png',
    }
  ];

  // Handle email submission and start game
  const handleEmailSubmit = async (email) => {
    setPlayerEmail(email);
    setGamePhase('game');
    setIsGameActive(true);
    setGameStartTime(new Date());
    setTimeRemaining(180);

    localStorage.setItem('playerEmail', email);
    localStorage.setItem('gameStartTime', new Date().toISOString());
  };

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setIsGameActive(false);
    setGameEndTime(new Date());
    setGamePhase('results');
  }, []);

  // Handle skill drag start
  const handleDragStart = (skillId) => {
    setDraggedSkillId(skillId);
  };

  // Handle skill drag end
  const handleDragEnd = () => {
    setDraggedSkillId(null);
  };

  // Handle skill drop into a bucket
  const handleSkillDrop = (droppedSkill, targetCategory) => {
    // Prevent dropping if skill is already placed
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

    // Trigger the popup animation for the target bucket
    setAnimatedBucketCategory(targetCategory);
    // Remove the animation class after a short delay (0.5s)
    setTimeout(() => {
      setAnimatedBucketCategory(null);
    }, 500);

    // Check if all skills are placed to end the game
    const newPlacedCount = Object.keys(placedSkills).length + 1;
    if (newPlacedCount === skills.length) {
      setTimeout(() => {
        setIsGameActive(false);
        setGameEndTime(new Date());
        setGamePhase('results');
      }, 500);
    }
  };

  // Allow dropping by preventing default dragover behavior
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Process the drop event on a bucket
  const handleBucketDrop = (e, category) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      handleSkillDrop(data, category);
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };

  // Reset game state for "Play Again"
  const handlePlayAgain = () => {
    setGamePhase('email');
    setPlayerEmail('');
    setIsGameActive(false);
    setScore(0);
    setCorrectPlacements(0);
    setPlacedSkills({});
    setDraggedSkillId(null);
    setTimeRemaining(180);
    setGameStartTime(null);
    setGameEndTime(null);
    setAnimatedBucketCategory(null); // Reset animation state

    localStorage.removeItem('playerEmail');
    localStorage.removeItem('gameStartTime');
    localStorage.removeItem('skillBucketGameResults');
  };

  // Handle sharing game results
  const handleShareResults = () => {
    const shareData = {
      title: 'Flipkart Seller Hub Sorting Game Results',
      text: `I scored ${score} out of ${skills.length} in the Flipkart Seller Hub Sorting Game! 🎯`,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(console.error);
    } else {
      const shareText = `${shareData.text}\n\nPlay the game: ${shareData.url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard! Share with your friends.');
      }).catch(() => {
        console.log('Clipboard not supported');
      });
    }
  };

  // Timer effect to decrement timeRemaining
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

  // Set page title based on the current game phase
  useEffect(() => {
    const titles = {
      email: 'Start Game - Flipkart Seller Hub Sorting Game',
      game: 'Playing - Flipkart Seller Hub Sorting Game',
      results: 'Results - Flipkart Seller Hub Sorting Game'
    };
    document.title = titles[gamePhase];
  }, [gamePhase]);

  return (
    <div className="min-h-screen bg-background">

      {/* Email Entry Phase */}
      {gamePhase === 'email' && (
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-8 px-4">
            <div className="space-y-4">
              <EmailForm onEmailSubmit={handleEmailSubmit} />
            </div>
          </div>
        </main>
      )}

      {/* Game Play Phase */}
      {gamePhase === 'game' && (
        <main
          className="h-screen w-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center pt-[320px] px-4 "
          style={{
            backgroundImage: "url('/assets/images/s2.png')"
          }}
        >
          {/* Heading */}
          <h2 className="text-[60px] font-bold text-[#00B5DB] text-center mb-16">
            Drag & drop to sort the items<br />into their respective buckets
          </h2>
          {/* Skill Cards */}
          <div className="grid grid-cols-3 gap-6 mb-20">
            {skills.map((skill) => (
              !placedSkills[skill.id] && ( // Only render skills not yet placed
                <div
                  key={skill.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify(skill));
                    handleDragStart(skill.id);
                  }}
                  onDragEnd={handleDragEnd}
                  className={`
                    p-[2px] rounded-lg bg-gradient-to-r from-[#4216EF] to-[#11BBDE]
                    cursor-grab active:cursor-grabbing hover:scale-105 transition
                    ${draggedSkillId === skill.id ? 'opacity-50 scale-105' : ''}
                  `}
                >
                  <div className="text-center text-[14px] font-medium py-4 px-3 bg-white rounded-md shadow-sm">
                    {skill.skill}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Buckets Grid */}
          <div className="grid grid-cols-3 gap-24 ">
            {initialBuckets.map((bucket) => (
              <div
                key={bucket.category}
                onDragOver={handleDragOver}
                onDrop={(e) => handleBucketDrop(e, bucket.category)}
                className="relative flex flex-col items-center justify-center"
              >
                <img
                  src={bucket.image}
                  alt={bucket.category}
                  className={`w-[230px] h-auto transition-transform duration-500 ease-out
                    ${animatedBucketCategory === bucket.category ? 'animate-bucket-receive' : ''}
                  `}
                />
              </div>
            ))}
          </div>

          {/* Timer */}
          <div className="absolute bottom-20 left-0 w-full flex justify-center">
            <div className="text-white text-5xl font-bold px-16 py-5 rounded-full">
              <GameTimer onTimeUp={handleTimeUp} isGameActive={isGameActive} />
            </div>
          </div>
        </main>
      )}

      {/* Results Phase */}
      {gamePhase === 'results' && (
        <main
          className="min-h-screen w-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center"
          style={{
            // Conditional background image based on score
            backgroundImage: score === 0 ? "url('/assets/images/s4.png')" : "url('/assets/images/s3.png')"
          }}
        >
          {score > 0 && ( // Only show score details if score is greater than 0
            <div className="flex flex-col items-center justify-center text-center px-6 pt-[1241px]">
              <h1 className="text-[72px] font-bold text-white mb-4">CONGRATULATIONS!</h1>
              <p className="text-[64px] text-white mb-2">You Got</p>
              <div className="text-[74px] font-bold text-white">
                {score}/{skills.length}
              </div>
              <p className="text-[74px] text-white mt-2">Correct Answers</p>
            </div>
          )}

          {/* Action Buttons are shown regardless of score, or you can make them conditional too */}
          <div className="mt-12">
            <ActionButtons
              onPlayAgain={handlePlayAgain}
              onShareResults={handleShareResults}
            />
          </div>
        </main>
      )}

      {/* Background Decoration (fixed behind all content) - This should not interfere with the main content's background */}
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