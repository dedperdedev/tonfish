import { Routes, Route, Navigate } from 'react-router-dom';
import { LakePage } from './pages/LakePage';
import { ShopPage } from './pages/ShopPage';
import { FishingPage } from './pages/FishingPage';
import { RafflePage } from './pages/RafflePage';
import { TasksPage } from './pages/TasksPage';
import { FriendsPage } from './pages/FriendsPage';
import { WalletPage } from './pages/WalletPage';
import { BottomTabs } from './components/BottomTabs';

function App() {
  return (
    <div className="app relative h-full w-full">
      <Routes>
        <Route path="/" element={<Navigate to="/lake" replace />} />
        <Route path="/lake" element={<LakePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/fishing" element={<FishingPage />} />
        <Route path="/raffle" element={<RafflePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
      <BottomTabs />
    </div>
  );
}

export default App;

