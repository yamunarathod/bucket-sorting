import React, { useState, useEffect, useCallback } from 'react';
import EmailForm from './components/EmailForm';
import GameTimer from '../game-play-screen/components/GameTimer';
import ActionButtons from './components/ActionButtons';
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

  // Initialize game results hook
  const { submitResults } = useGameResults();

  const skillsData = [
    { id: 1, skill: "I want to onboard to FBF", category: "GROWTH" },
    { id: 2, skill: "I want to check return reasons", category: "SELECTION INSIGHTS" },
    { id: 3, skill: "I want to opt into Google Ads", category: "ADVERTISING" },
    { id: 4, skill: "I want to change settlement of my product", category: "PAYMENTS" },
    { id: 5, skill: "I want to understand new market trend", category: "SELECTION INSIGHTS" },
    { id: 6, skill: "I want to explore Dhamaka selection", category: "INVENTORY" }
  ];
  const [skills] = useState(skillsData);

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
    setTimeRemaining(180);
    localStorage.setItem('playerEmail', email);
    localStorage.setItem('gameStartTime', new Date().toISOString());
  };

  const handleTimeUp = useCallback(async () => {
    setIsGameActive(false);
    setGameEndTime(new Date());
    
    // Submit game results to API (non-blocking with validation)
    try {
      if (playerEmail && playerEmail.trim() !== '' && typeof score === 'number') {
        await submitResults(playerEmail, score);
      } else {
        console.warn('Game results not submitted: missing or invalid data', { 
          email: playerEmail, 
          score: score 
        });
      }
    } catch (error) {
      // Error is already handled in the hook, but log for additional context
      console.error('Error during game completion API submission:', error);
    }
    
    setGamePhase('results');
  }, [playerEmail, score, submitResults]);

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
        
        // Submit game results to API when all skills are placed (non-blocking with validation)
        try {
          if (playerEmail && playerEmail.trim() !== '') {
            const finalScore = isCorrect ? score + 1 : score;
            if (typeof finalScore === 'number') {
              await submitResults(playerEmail, finalScore);
            } else {
              console.warn('Game results not submitted: invalid final score', { 
                email: playerEmail, 
                finalScore: finalScore 
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
            ))}
          </div>
          <div className="grid grid-cols-3 gap-24">
            {initialBuckets.map(bucket => (
              <div
                key={bucket.category}
                onDragOver={handleDragOver}
                onDrop={(e) => handleBucketDrop(e, bucket.category)}
                className="relative flex flex-col items-center justify-center"
              >
                <img
                  src={bucket.image}
                  alt={bucket.category}
                  className={`w-[230px] h-auto transition-transform duration-500 ease-out ${
                    animatedBucketCategory === bucket.category ? 'animate-bucket-receive' : ''
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
            backgroundImage: score === 0 ? "url('/assets/images/s4.png')" : "url('/assets/images/s3.png')"
          }}
        >
          {score > 0 && (
            <div className="flex flex-col items-center justify-center text-center px-6 pt-[1241px]">
              <h1 className="text-[72px] font-bold text-white mb-4">CONGRATULATIONS!</h1>
              <p className="text-[64px] text-white mb-2">You Got</p>
              <div className="text-[74px] font-bold text-white">
                {score}/{skills.length}
              </div>
              <p className="text-[74px] text-white mt-2">Correct Answers</p>
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
