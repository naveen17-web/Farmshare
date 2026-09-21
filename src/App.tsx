import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { EquipmentListingPage } from './components/EquipmentListingPage';
import { EquipmentDetailPage } from './components/EquipmentDetailPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FarmerPortal } from './components/FarmerPortal';
import { OwnerPortal } from './components/OwnerPortal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { Footer } from './components/Footer';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);

  // Auth modal control
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register-farmer' | 'register-owner'>('login');
  const [codeExplorerOpen, setCodeExplorerOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register-farmer' | 'register-owner' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (role?: UserRole) => {
    setAuthModalOpen(false);
    if (role === 'FARMER' && currentView === 'home') {
      setCurrentView('farmer-portal');
    } else if (role === 'OWNER' && currentView === 'home') {
      setCurrentView('owner-portal');
    } else if (role === 'ADMIN' && currentView === 'home') {
      setCurrentView('admin-portal');
    }
  };

  const handleNavigate = (view: string, extraData?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'equipment-detail') {
      const eqId =
        typeof extraData === 'number'
          ? extraData
          : extraData?.equipmentId || extraData?.id || extraData;
      if (eqId) {
        setSelectedEquipmentId(Number(eqId));
      }
    }

    setCurrentView(view);
  };

  // Render view based on state
  const renderView = () => {
    // Equipment Detail
    if (currentView === 'equipment-detail') {
      const eqId = selectedEquipmentId || 101;
      return (
        <EquipmentDetailPage
          equipmentId={eqId}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
        />
      );
    }

    // Farmer Routes
    if (
      currentView === 'farmer-portal' ||
      currentView === 'farmer-dashboard' ||
      currentView === 'farmer-bookings' ||
      currentView === 'farmer-active' ||
      currentView === 'farmer-payments' ||
      currentView === 'farmer-reviews' ||
      currentView === 'farmer-profile'
    ) {
      let subTab: any = 'dashboard';
      if (currentView === 'farmer-bookings') subTab = 'bookings';
      if (currentView === 'farmer-active') subTab = 'active';
      if (currentView === 'farmer-payments') subTab = 'payments';
      if (currentView === 'farmer-reviews') subTab = 'reviews';
      if (currentView === 'farmer-profile') subTab = 'profile';

      return <FarmerPortal initialSubTab={subTab} onNavigate={handleNavigate} />;
    }

    // Owner Routes
    if (
      currentView === 'owner-portal' ||
      currentView === 'owner-dashboard' ||
      currentView === 'owner-equipment' ||
      currentView === 'owner-requests' ||
      currentView === 'owner-active'
    ) {
      let subTab: any = 'dashboard';
      if (currentView === 'owner-equipment') subTab = 'equipment';
      if (currentView === 'owner-requests') subTab = 'requests';
      if (currentView === 'owner-active') subTab = 'active';

      return <OwnerPortal initialSubTab={subTab} onNavigate={handleNavigate} />;
    }

    // Admin Routes
    if (
      currentView === 'admin-portal' ||
      currentView === 'admin-dashboard' ||
      currentView === 'admin-owners' ||
      currentView === 'admin-users' ||
      currentView === 'admin-equipment' ||
      currentView === 'admin-bookings' ||
      currentView === 'admin-complaints' ||
      currentView === 'admin-reviews' ||
      currentView === 'admin-centers' ||
      currentView === 'admin-payments'
    ) {
      let subTab: any = 'stats';
      if (currentView === 'admin-owners') subTab = 'owners';
      if (currentView === 'admin-users') subTab = 'users';
      if (currentView === 'admin-equipment') subTab = 'equipment';
      if (currentView === 'admin-bookings') subTab = 'bookings';
      if (currentView === 'admin-complaints') subTab = 'complaints';
      if (currentView === 'admin-reviews') subTab = 'reviews';
      if (currentView === 'admin-centers') subTab = 'centers';
      if (currentView === 'admin-payments') subTab = 'payments';

      return <AdminPortal initialSubTab={subTab} onNavigate={handleNavigate} />;
    }

    // Public Pages
    switch (currentView) {
      case 'equipment':
        return (
          <EquipmentListingPage
            onNavigate={handleNavigate}
          />
        );
      case 'how-it-works':
        return <HowItWorksPage onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased">
      {/* Navbar with Role Switcher & Live Notifications */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenCodeExplorer={() => setCodeExplorerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">{renderView()}</main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Backend Architecture & Java Code Inspector Modal */}
      <CodeExplorerModal
        isOpen={codeExplorerOpen}
        onClose={() => setCodeExplorerOpen(false)}
      />

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        initialTab={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
