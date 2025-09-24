'use client';

import { useEffect, useState } from 'react';

interface LiveCounterProps {
  value: number;
  label: string;
}

export default function LiveCounter({ value, label }: LiveCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const stepValue = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayValue(Math.round(stepValue * currentStep));
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
      <div className="text-4xl font-bold text-primary-600 mb-1 animate-number">
        {displayValue.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
