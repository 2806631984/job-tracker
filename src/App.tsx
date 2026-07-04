import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobForm from './pages/JobForm';
import JobDetail from './pages/JobDetail';
import Templates from './pages/Templates';
import Tags from './pages/Tags';
import Login from './pages/Login';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/new" element={<JobForm />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/tags" element={<Tags />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
