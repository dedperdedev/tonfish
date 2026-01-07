import { useEffect, useRef } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface FishActionButtonProps {
  state: 'cast' | 'hook' | 'disabled';
  onClick?: () => void;
  className?: string;
}

export function FishActionButton({ state, onClick, className = '' }: FishActionButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  // Trigger haptic feedback when switching to hook state
  useEffect(() => {
    if (state === 'hook') {
      try {
        const tg = (window as any).Telegram;
        if (tg?.WebApp?.HapticFeedback) {
          tg.WebApp.HapticFeedback.impactOccurred('light');
        } else {
          triggerHaptic('light');
        }
      } catch (e) {
        // Fallback to our haptics utility
        triggerHaptic('light');
      }
    }
  }, [state]);

  // Shimmer effect every few seconds
  useEffect(() => {
    if (!shimmerRef.current || state === 'disabled') return;

    const interval = setInterval(() => {
      if (shimmerRef.current) {
        shimmerRef.current.style.animation = 'none';
        // Trigger reflow
        void shimmerRef.current.offsetWidth;
        shimmerRef.current.style.animation = '';
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [state]);

  const handleMouseDown = () => {
    if (state !== 'disabled') {
      triggerHaptic('light');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== 'disabled' && onClick) {
      onClick();
    }
  };

  return (
    <div className={`fish-action-button-wrapper ${className}`} data-state={state}>
      {/* Outer animated ring */}
      <div className="fish-action-button-ring" />
      
      {/* Main button */}
      <button
        ref={buttonRef}
        className="fish-action-button"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        disabled={state === 'disabled'}
        data-state={state}
      >
        {/* Glass base with depth */}
        <div className="fish-action-button-glass">
          {/* Grain texture */}
          <div className="fish-action-button-grain" />
          
          {/* Shimmer effect */}
          <div ref={shimmerRef} className="fish-action-button-shimmer" />
          
          {/* Top highlight */}
          <div className="fish-action-button-highlight" />
        </div>
        
        {/* Content */}
        <div className="fish-action-button-content">
          {/* Icon */}
          <div className="fish-action-button-icon">
            {state === 'cast' ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l18-9-9 18-9-9z" />
              </svg>
            ) : state === 'hook' ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6l-6 6-6-6" />
                <path d="M12 12v8" />
              </svg>
            ) : null}
          </div>
          
          {/* Label */}
          <div className="fish-action-button-label">
            {state === 'cast' ? 'Закинуть' : state === 'hook' ? 'Подсечь' : ''}
          </div>
        </div>
      </button>
    </div>
  );
}

