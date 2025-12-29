import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import MealPlanPreview from './pages/MealPlanPreview';
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { isAuthenticated, isOnboarding } = useStore();

  // Show onboarding if user is in onboarding flow
  if (isOnboarding) {
    return <OnboardingPage />;
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/meal-plan-preview" element={<MealPlanPreview />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/meal-planner" element={<Layout><MealPlanner /></Layout>} />
      <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
      <Route path="/recipes/:id" element={<Layout><RecipeDetail /></Layout>} />
      <Route path="/progress" element={<Layout><Progress /></Layout>} />
      <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;


