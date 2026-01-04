import { useNavigate, useLocation } from 'react-router-dom';
import { Waves, ShoppingBag, Store, CheckSquare, Users } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

const tabs = [
  { id: 'lake', label: 'Озеро', Icon: Waves, path: '/lake' },
  { id: 'shop', label: 'Магазин', Icon: ShoppingBag, path: '/shop' },
  { id: 'market', label: 'Рынок', Icon: Store, path: '/market' },
  { id: 'tasks', label: 'Таски', Icon: CheckSquare, path: '/tasks' },
  { id: 'friends', label: 'Друзья', Icon: Users, path: '/friends' },
];

export function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="absolute left-3.5 right-3.5 bottom-[calc(var(--safe-bottom)+8px)] z-[6] h-14 rounded-[24px] grid grid-cols-5 gap-1 p-1.5 glass-card shadow-game">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/lake' && location.pathname === '/');
        const Icon = tab.Icon;
        return (
          <button
            key={tab.id}
            className={`border-0 bg-transparent rounded-[18px] grid place-items-center gap-0.5 cursor-pointer transition-all duration-120 select-none ${
              isActive
                ? 'bg-aqua/18 text-ink translate-y-[-1px]'
                : 'text-[rgba(11,42,51,.70)]'
            }`}
            onClick={() => {
              triggerHaptic('light');
              navigate(tab.path);
            }}
          >
            <span
              className={`w-[22px] h-[22px] grid place-items-center rounded-xl ${
                isActive
                  ? 'bg-gradient-to-br from-aqua/35 to-aqua2/22'
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

