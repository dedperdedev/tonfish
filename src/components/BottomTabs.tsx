import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'lake', label: 'Озеро', icon: '🏞️', path: '/lake' },
  { id: 'shop', label: 'Магазин', icon: '🛍️', path: '/shop' },
  { id: 'market', label: 'Рынок', icon: '🏪', path: '/market' },
  { id: 'tasks', label: 'Таски', icon: '✅', path: '/tasks' },
  { id: 'friends', label: 'Друзья', icon: '👥', path: '/friends' },
];

export function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="absolute left-3.5 right-3.5 bottom-[calc(var(--safe-bottom)+12px)] z-[6] h-16 rounded-[26px] grid grid-cols-5 gap-1.5 p-2 glass-card shadow-game">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/lake' && location.pathname === '/');
        return (
          <button
            key={tab.id}
            className={`border-0 bg-transparent rounded-[18px] grid place-items-center gap-0.5 cursor-pointer transition-all duration-120 select-none ${
              isActive
                ? 'bg-aqua/18 text-ink translate-y-[-1px]'
                : 'text-[rgba(11,42,51,.70)]'
            }`}
            onClick={() => navigate(tab.path)}
          >
            <span
              className={`w-[22px] h-[22px] grid place-items-center rounded-xl ${
                isActive
                  ? 'bg-gradient-to-br from-aqua/35 to-aqua2/22'
                  : ''
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-black text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

