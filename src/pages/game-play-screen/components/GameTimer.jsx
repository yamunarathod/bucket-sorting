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
    <div className="flex items-center justify-center bg-white rounded-lg px-6 py-3 shadow-lg border">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Timer</div>
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default GameTimer;