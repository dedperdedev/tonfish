import { Routes, Route, Navigate } from 'react-router-dom';
import { LakePage } from './pages/LakePage';
import { ShopPage } from './pages/ShopPage';
import { FishingPage } from './pages/FishingPage';
import { MarketPage } from './pages/MarketPage';
import { TasksPage } from './pages/TasksPage';
import { FriendsPage } from './pages/FriendsPage';
import { WalletPage } from './pages/WalletPage';
import { BottomTabs } from './components/BottomTabs';
import { RaffleButton } from './components/RaffleButton';

function App() {
  return (
    <div className="app relative h-full w-full">
      <Routes>
        <Route path="/" element={<Navigate to="/lake" replace />} />
        <Route path="/lake" element={<LakePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/fishing" element={<FishingPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
      <RaffleButton />
      <BottomTabs />
    </div>
  );
}

export default App;

