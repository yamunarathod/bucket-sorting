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


    <div
      className="fixed bottom-10 left-0 w-full px-10 z-10 flex items-center justify-center gap-4 text-[60px] font-bold text-white"
      style={{
        background:
          "linear-gradient(to right, #30c5e5 0%, rgba(48,197,229,0.05) 45%, rgba(6,50,185,0.05) 55%, #0632b9 100%)",
      }}
    >
      <img src="/timer.png" alt="Timer" className="w-[110px] h-[110px]" />
      <span>{formatTime(timeLeft)}</span></div>
  );
};

export default GameTimer;