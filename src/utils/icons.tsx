import React from 'react';

interface IconProps {
  src?: string;
  fallback: string;
  alt: string;
  className?: string;
  size?: number;
}

export function Icon({ src, fallback, alt, className = '', size = 48 }: IconProps) {
  const baseUrl = import.meta.env.DEV ? '' : import.meta.env.BASE_URL;
  const fullSrc = src ? `${baseUrl}${src}` : null;
  const [imgError, setImgError] = React.useState(false);

  if (!fullSrc || imgError) {
    return (
      <span className={`inline-block text-center ${className}`} style={{ fontSize: `${size * 0.7}px` }}>
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={fullSrc}
      alt={alt}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onError={() => setImgError(true)}
    />
  );
}

// Fallback emoji maps (used only when icon is missing)
export const rodEmojiFallbacks: Record<string, string> = {
  stick: '🪵',
  reed: '🌾',
  bamboo: '🎋',
  telescopic: '📏',
  spinning: '🎣',
  feeder: '🧺',
  boom: '💥',
};

export const catchEmojiFallbacks: Record<string, string> = {
  Головастик: '🐸',
  Лягушка: '🐸',
  Бычок: '🐟',
  Карась: '🐟',
  Окунь: '🐟',
  Щука: '🐟',
  Судак: '🐟',
  Карп: '🐟',
  Амур: '🐟',
  Акула: '🦈',
  'Консервная банка': '🥫',
  Сапог: '👢',
  'Старая блесна': '🪝',
  'Ржавая цепь': '⛓️',
  Тина: '🪸',
  Ил: '🟫',
  Пакет: '🛍️',
  'Якорь-брелок': '⚓',
  Сундук: '🧰',
  Кость: '🦴',
};

export const taskEmojiFallbacks: Record<string, string> = {
  daily: '📅',
  sub: '📣',
  invite: '👥',
  firstbuy: '🛍️',
};

