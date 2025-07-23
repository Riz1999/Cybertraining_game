import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './App.css';
import './styles/animations.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { loadUser } from './store/actions/authActions';
import Spinner from './components/ui/Spinner';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ModulesPage = lazy(() => import('./pages/ModulesPage'));
const ModuleDetailPage = lazy(() => import('./pages/ModuleDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const DialogSimulationPage = lazy(() => import('./pages/DialogSimulationPage'));
const TimerDemoPage = lazy(() => import('./pages/TimerDemoPage'));
const SystemMapPage = lazy(() => import('./pages/SystemMapPage'));
const BadgeTestPage = lazy(() => import('./pages/BadgeTestPage'));
const VictimDialogSimulationPage = lazy(() => import('./pages/VictimDialogSimulationPage'));
const ComplaintCategorizationPage = lazy(() => import('./pages/ComplaintCategorizationPage'));
const TransactionFreezeSimulationPage = lazy(() => import('./pages/TransactionFreezeSimulationPage'));
const ComplaintDelayScenarioPage = lazy(() => import('./pages/ComplaintDelayScenarioPage'));
const FinancialFraudInvestigationPage = lazy(() => import('./pages/FinancialFraudInvestigationPage'));
const ArrestProsecutionPage = lazy(() => import('./pages/ArrestProsecutionPage'));
const Module5Test = lazy(() => import('./components/test/Module5Test'));
const Module5TestPage = lazy(() => import('./pages/Module5TestPage'));
const TestModule5Status = lazy(() => import('./pages/TestModule5Status'));
const MatchPairsTestPage = lazy(() => import('./pages/MatchPairsTestPage'));

// Placeholder components
const NotFound = () => <div className="p-4">404 - Page Not Found</div>;

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner size="lg" />
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in (has token)
    if (localStorage.getItem('accessToken')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <AuthProvider>
      <ProgressProvider>
        <div className="app-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules"
            element={
              <ProtectedRoute>
                <ModulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules/:moduleId"
            element={
              <ProtectedRoute>
                <ModuleDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulations/:simulationId"
            element={
              <ProtectedRoute>
                <SimulationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dialog-simulation"
            element={<DialogSimulationPage />}
          />
          <Route
            path="/timer-demo"
            element={<TimerDemoPage />}
          />
          <Route
            path="/system-map"
            element={<SystemMapPage />}
          />
          <Route
            path="/badge-test"
            element={<BadgeTestPage />}
          />
          <Route
            path="/victim-dialog"
            element={<VictimDialogSimulationPage />}
          />
          <Route
            path="/complaint-categorization"
            element={<ComplaintCategorizationPage />}
          />
          <Route
            path="/transaction-freeze"
            element={<TransactionFreezeSimulationPage />}
          />
          <Route
            path="/complaint-delay"
            element={<ComplaintDelayScenarioPage />}
          />
          <Route
            path="/modules/module-5-financial-fraud-investigation/:level"
            element={
              <ProtectedRoute>
                <FinancialFraudInvestigationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules/module-5-financial-fraud-investigation/arrest-prosecution"
            element={
              <ProtectedRoute>
                <ArrestProsecutionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/module5"
            element={<Module5Test />}
          />
          <Route
            path="/test/module5-page"
            element={<Module5TestPage />}
          />
          <Route
            path="/test/module5-status"
            element={<TestModule5Status />}
          />
          <Route
            path="/test/match-pairs"
            element={<MatchPairsTestPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;