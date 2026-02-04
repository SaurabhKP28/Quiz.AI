'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // seconds (60 per question)
  onTimeUp: () => void;
  isActive: boolean;
}

export default function Timer({ duration, onTimeUp, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const hasTriggered = useRef(false);

  /* 🔁 Reset timer when question changes */
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
      hasTriggered.current = false;
    }
  }, [duration, isActive]);

  /* ⏱ Countdown */
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  /* 🚨 Fire time-up safely AFTER render */
  useEffect(() => {
    if (timeLeft <= 0 && isActive && !hasTriggered.current) {
      hasTriggered.current = true;
      onTimeUp();
    }
  }, [timeLeft, isActive, onTimeUp]);

  /* ⏰ UI */
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColor = () => {
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-5 w-5 ${getColor()}`} />
      <span className={`font-mono font-semibold ${getColor()}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
