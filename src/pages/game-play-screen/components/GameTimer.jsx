import React, { useState, useEffect } from 'react';

const GameTimer = ({ onTimeUp, isGameActive }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-orange-600';
    return 'text-blue-600';
  };

  return (
    <div className="mt-12 z-10 bg-yellow-400 text-[#3B2EDB] font-bold px-5 py-2 rounded-full flex items-center justify-center space-x-2 text-lg">
        <div className="w-3 h-3 bg-[#3B2EDB] rounded-full" />
        <span>{formatTime(timeLeft)}</span>
      </div>
  );
};

export default GameTimer;