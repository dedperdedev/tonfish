import { useNavigate, useLocation } from 'react-router-dom';
import { Waves, ShoppingBag, Trophy, CheckSquare, Users } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

const tabs = [
  { id: 'lake', label: 'Озеро', Icon: Waves, path: '/lake' },
  { id: 'shop', label: 'Магазин', Icon: ShoppingBag, path: '/shop' },
  { id: 'raffle', label: 'Лотерея', Icon: Trophy, path: '/raffle' },
  { id: 'tasks', label: 'Таски', Icon: CheckSquare, path: '/tasks' },
  { id: 'friends', label: 'Друзья', Icon: Users, path: '/friends' },
];

export function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="absolute left-2 right-2 bottom-[calc(var(--safe-bottom)+8px)] z-[6] h-14 rounded-2xl grid grid-cols-5 gap-1 glass-card" style={{ margin: 0, border: 0, paddingTop: '5px', paddingBottom: '5px', paddingLeft: '8px', paddingRight: '8px' }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/lake' && location.pathname === '/');
        const Icon = tab.Icon;
        return (
          <button
            key={tab.id}
            className={`border-0 bg-transparent rounded-2xl grid place-items-center gap-0.5 cursor-pointer transition-all duration-200 select-none ${
              isActive
                ? 'bg-white/30 text-ink'
                : 'text-[rgba(11,42,51,.70)]'
            }`}
            onClick={() => {
              triggerHaptic('light');
              navigate(tab.path);
            }}
            onMouseDown={() => triggerHaptic('light')}
          >
            <span
              className={`w-[22px] h-[22px] grid place-items-center rounded-xl transition-all ${
                isActive
                  ? 'bg-white/40'
                  : ''
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </span>
            <span className="font-black text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

