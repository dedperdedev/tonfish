import type { Rod } from '../types';

export function getRarityColors(rarity: Rod['rarity']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (rarity) {
    case 'Common':
      return {
        bg: 'bg-gray-500/55',
        text: 'text-gray-900',
        border: 'border-gray-400/88',
      };
    case 'Uncommon':
      return {
        bg: 'bg-green-500/55',
        text: 'text-green-900',
        border: 'border-green-400/88',
      };
    case 'Rare':
      return {
        bg: 'bg-blue-500/55',
        text: 'text-blue-900',
        border: 'border-blue-400/88',
      };
    case 'Epic':
      return {
        bg: 'bg-purple-500/55',
        text: 'text-purple-900',
        border: 'border-purple-400/88',
      };
    case 'Legendary':
      return {
        bg: 'bg-orange-500/55',
        text: 'text-orange-900',
        border: 'border-orange-400/88',
      };
    case 'Mythic':
      return {
        bg: 'bg-pink-500/55',
        text: 'text-pink-900',
        border: 'border-pink-400/88',
      };
    case 'Apex':
      return {
        bg: 'bg-gradient-to-br from-yellow-500/55 to-red-500/55',
        text: 'text-yellow-900',
        border: 'border-yellow-400/88',
      };
    default:
      return {
        bg: 'bg-gray-500/55',
        text: 'text-gray-900',
        border: 'border-gray-400/88',
      };
  }
}

