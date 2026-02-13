import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { RaffleModal } from './RaffleModal';

export function RaffleButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed right-3 top-1/2 -translate-y-1/2 z-[5] flex flex-col items-center gap-1 cursor-pointer animate-bounce-slow"
        onClick={() => setIsOpen(true)}
        title="Розыгрыш 100 TON"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 4px 20px rgba(255, 165, 0, 0.4)',
          }}
        >
          <Trophy size={28} strokeWidth={2.5} className="text-white" />
        </div>
        <span
          className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#4a2800',
          }}
        >
          100TON
        </span>
      </button>

      {isOpen && <RaffleModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
