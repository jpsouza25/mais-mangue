import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/usuarios" element={<UserManagement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'Work Sans, sans-serif',
            borderRadius: '14px',
            border: '1px solid rgba(64, 73, 37, 0.12)',
          },
        }}
      />
    </>
  );
}
