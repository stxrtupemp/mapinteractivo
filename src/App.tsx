import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ADMIN_PATH } from './lib/constants';
import { useAuth } from './hooks/useAuth';
import VisitorPage from './pages/VisitorPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to={`/${ADMIN_PATH}/login`} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VisitorPage />} />
        <Route path={`/${ADMIN_PATH}/login`} element={<LoginPage />} />
        <Route
          path={`/${ADMIN_PATH}`}
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
