import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface QuestionTimerProps {
  isActive: boolean;
  onTimeUpdate: (timeInSeconds: number) => void;
  className?: string;
}

export default function QuestionTimer({ isActive, onTimeUpdate, className = "" }: QuestionTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {formatTime(seconds)}
      </span>
      <span className="text-xs text-gray-500">on this question</span>
    </div>
  );
}