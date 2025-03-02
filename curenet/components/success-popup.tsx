'use client';

import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface SuccessPopupProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function SuccessPopup({
  message,
  duration = 3000,
  onClose,
}: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <p className="text-sm text-green-800">{message}</p>
      </div>
    </div>
  );
}
