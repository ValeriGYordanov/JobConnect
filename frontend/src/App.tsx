import './index.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { OfferingsPage } from './pages/OfferingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center">
            <Link to="/" className="font-semibold">Offerings</Link>
            <div className="ml-auto flex gap-3">
              <Link to="/profile" className="text-sm">Profile</Link>
              <Link to="/admin" className="text-sm">Admin</Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<OfferingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <footer className="border-t text-center text-xs py-4">Demo C2C Offerings</footer>
      </div>
    </BrowserRouter>
  );
}
