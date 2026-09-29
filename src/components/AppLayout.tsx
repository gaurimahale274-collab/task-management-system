import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { ToastContainer } from './ToastContainer';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Get current section title for top header
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/tasks/add':
        return 'Add Task';
      case '/tasks':
        return 'My Tasks';
      case '/tasks/completed':
        return 'Completed Tasks';
      case '/reports':
        return 'Reports';
      case '/profile':
        return 'Profile';
      default:
        return 'TaskFlow';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#181715] flex text-[#292824] dark:text-[#EDE9E3]">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex shrink-0" />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          pageTitle={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};
