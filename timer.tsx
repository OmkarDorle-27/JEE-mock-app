import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
  onTick: (time: number) => void;
}

export default function Timer({ timeRemaining, onTimeUp, onTick }: TimerProps) {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime - 1000;
        onTick(newTime);
        
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, onTick]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = time < 5 * 60 * 1000; // Last 5 minutes

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
      isLowTime ? 'bg-red-100 animate-pulse' : 'bg-red-50'
    }`}>
      <Clock className="h-4 w-4 text-red-600" />
      <span className="text-red-600 font-mono font-semibold text-lg">
        {formatTime(time)}
      </span>
    </div>
  );
}
