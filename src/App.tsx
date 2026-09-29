import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { TaskProvider } from './context/TaskContext';
import { AppLayout } from './components/AppLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AddTask } from './pages/AddTask';
import { MyTasks } from './pages/MyTasks';
import { CompletedTasks } from './pages/CompletedTasks';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';

/**
 * Route protector for authenticated views
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#181715] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Public route redirector (e.g. login/register when already logged in)
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#181715] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * Inner application root wiring providers with active user email
 */
const AppRoot: React.FC = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider userEmail={user?.email}>
      <NotificationProvider userEmail={user?.email}>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Workspace Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks/add" element={<AddTask />} />
                <Route path="/tasks" element={<MyTasks />} />
                <Route path="/tasks/completed" element={<CompletedTasks />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Root redirect */}
              <Route
                path="/"
                element={
                  <Navigate to={user ? '/dashboard' : '/login'} replace />
                }
              />
              {/* Fallback */}
              <Route
                path="*"
                element={
                  <Navigate to={user ? '/dashboard' : '/login'} replace />
                }
              />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}
