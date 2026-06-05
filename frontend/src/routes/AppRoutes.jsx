import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AppLayout from '../components/layout/AppLayout';

// Public pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import BrowsePage from '../pages/public/BrowsePage';
import UserProfilePage from '../pages/public/UserProfilePage';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// App pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import EditProfilePage from '../pages/dashboard/EditProfilePage';
import MySkillsPage from '../pages/skills/MySkillsPage';
import SkillFormPage from '../pages/skills/SkillFormPage';
import SearchPage from '../pages/skills/SearchPage';
import ExchangesPage from '../pages/exchanges/ExchangesPage';
import ExchangeDetailPage from '../pages/exchanges/ExchangeDetailPage';
import NewExchangePage from '../pages/exchanges/NewExchangePage';
import NewReviewPage from '../pages/reviews/NewReviewPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AuthLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <AppLayout />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      </Route>

      {/* Authenticated app layout */}
      <Route element={<AuthLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/my-skills" element={<MySkillsPage />} />
        <Route path="/skills/add" element={<SkillFormPage />} />
        <Route path="/skills/edit/:id" element={<SkillFormPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/exchanges" element={<ExchangesPage />} />
        <Route path="/exchanges/new" element={<NewExchangePage />} />
        <Route path="/exchanges/:id" element={<ExchangeDetailPage />} />
        <Route path="/reviews/new/:exchangeId" element={<NewReviewPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
