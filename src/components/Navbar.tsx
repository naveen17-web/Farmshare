import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Tractor,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  Code2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extraData?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register-farmer' | 'register-owner') => void;
  onOpenCodeExplorer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenCodeExplorer,
}) => {
  const { currentUser, logout, switchUser, users, resetToDefaults } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic user resolution to reflect live name updates immediately in the navbar
  const farmerUser = (currentUser?.role === 'FARMER' ? currentUser : users.find((u) => u.role === 'FARMER')) || users.find((u) => u.id === 2);
  const ownerUser = (currentUser?.role === 'OWNER' ? currentUser : users.find((u) => u.role === 'OWNER')) || users.find((u) => u.id === 4);
  const adminUser = (currentUser?.role === 'ADMIN' ? currentUser : users.find((u) => u.role === 'ADMIN')) || users.find((u) => u.id === 1);

  const farmerDisplayName = farmerUser?.fullName ? farmerUser.fullName.trim().split(' ')[0] : 'Farmer';
  const ownerDisplayName = ownerUser?.fullName 
    ? (ownerUser.businessName ? ownerUser.businessName.trim().split(' ')[0] : ownerUser.fullName.trim().split(' ')[0])
    : 'Owner';
  const adminDisplayName = adminUser?.fullName ? adminUser.fullName.trim().split(' ')[0] : 'Admin';

  const getDashboardView = () => {
    if (!currentUser) return 'home';
    if (currentUser.role === 'ADMIN') return 'admin-dashboard';
    if (currentUser.role === 'OWNER') return 'owner-dashboard';
    return 'farmer-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Demo Switcher Ribbon */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-medium text-emerald-200">FarmShare Agricultural Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-300 font-medium hidden sm:inline">Role Quick Switch:</span>
          
          <button
            id="quick-switch-farmer"
            onClick={() => {
              if (farmerUser) switchUser(farmerUser.id);
              onNavigate('farmer-dashboard');
            }}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition flex items-center gap-1 ${
              currentUser?.role === 'FARMER'
                ? 'bg-emerald-600 text-white font-semibold ring-1 ring-emerald-300'
                : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200'
            }`}
            title={`Switch to Farmer (${farmerUser?.fullName || 'Farmer'})`}
          >
            <span>🌾 Farmer</span>
            <span className="opacity-90 font-normal">({farmerDisplayName})</span>
          </button>

          <button
            id="quick-switch-owner"
            onClick={() => {
              if (ownerUser) switchUser(ownerUser.id);
              onNavigate('owner-dashboard');
            }}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition flex items-center gap-1 ${
              currentUser?.role === 'OWNER'
                ? 'bg-emerald-600 text-white font-semibold ring-1 ring-emerald-300'
                : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200'
            }`}
            title={`Switch to Owner (${ownerUser?.businessName ? `${ownerUser.businessName} - ${ownerUser.fullName}` : ownerUser?.fullName || 'Owner'})`}
          >
            <span>🚜 Owner</span>
            <span className="opacity-90 font-normal">({ownerDisplayName})</span>
          </button>

          <button
            id="quick-switch-admin"
            onClick={() => {
              if (adminUser) switchUser(adminUser.id);
              onNavigate('admin-dashboard');
            }}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition flex items-center gap-1 ${
              currentUser?.role === 'ADMIN'
                ? 'bg-purple-700 text-white font-semibold ring-1 ring-purple-300'
                : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200'
            }`}
            title={`Switch to Admin (${adminUser?.fullName || 'Admin'})`}
          >
            <span>🛡️ Admin</span>
            <span className="opacity-90 font-normal">({adminDisplayName})</span>
          </button>

          {onOpenCodeExplorer && (
            <button
              id="btn-code-explorer"
              onClick={onOpenCodeExplorer}
              className="ml-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 flex items-center gap-1 shadow-xs"
              title="Inspect backend architecture and schema"
            >
              <Code2 className="w-3 h-3" />
              <span>Java & SQL</span>
            </button>
          )}

          <button
            id="btn-reset-demo"
            onClick={() => {
              if (confirm('Reset application data back to default demo state?')) {
                resetToDefaults();
                onNavigate('home');
              }
            }}
            className="text-emerald-400 hover:text-white p-0.5 rounded text-[11px] ml-1"
            title="Reset to default seed data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1">
                Farm<span className="text-emerald-600">Share</span>
              </div>
              <p className="text-[10px] text-stone-600 tracking-wider uppercase font-medium">Agri Equipment Rental</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'home'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Home
            </button>

            <button
              id="nav-equipment"
              onClick={() => onNavigate('equipment')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'equipment' || currentView === 'equipment-detail'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Find Equipment
            </button>

            <button
              id="nav-how-it-works"
              onClick={() => onNavigate('how-it-works')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'how-it-works'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              How It Works
            </button>

            <button
              id="nav-about"
              onClick={() => onNavigate('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'about'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact"
              onClick={() => onNavigate('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'contact'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Contact
            </button>

            {currentUser && (
              <button
                id="nav-dashboard-link"
                onClick={() => onNavigate(getDashboardView())}
                className={`ml-2 px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  currentView.includes('dashboard') ||
                  currentView.includes('farmer-') ||
                  currentView.includes('owner-') ||
                  currentView.includes('admin-')
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>
                  {currentUser.role === 'ADMIN'
                    ? 'Admin Portal'
                    : currentUser.role === 'OWNER'
                    ? 'Owner Hub'
                    : 'Farmer Dashboard'}
                </span>
              </button>
            )}
          </nav>

          {/* User Profile / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-semibold text-stone-800 line-clamp-1">{currentUser.fullName}</p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full inline-block ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : currentUser.role === 'OWNER'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-logout"
                  onClick={() => {
                    logout();
                    onNavigate('home');
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-login"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-emerald-700 rounded-lg hover:bg-stone-50 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="btn-nav-join"
                  onClick={() => onOpenAuth('register-farmer')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs shadow-emerald-700/20 transition cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('equipment');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700"
          >
            Find Equipment
          </button>
          <button
            onClick={() => {
              onNavigate('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700"
          >
            About FarmShare
          </button>
          <button
            onClick={() => {
              onNavigate('contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700"
          >
            Contact & Support
          </button>

          {currentUser ? (
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <button
                onClick={() => {
                  onNavigate(getDashboardView());
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-semibold bg-emerald-600 text-white rounded-md flex items-center justify-between"
              >
                <span>Go to Dashboard</span>
                <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded">{currentUser.role}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-md"
              >
                Log Out ({currentUser.fullName})
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-sm font-medium border border-stone-300 rounded-md"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register-farmer');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-sm font-semibold bg-emerald-600 text-white rounded-md"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
