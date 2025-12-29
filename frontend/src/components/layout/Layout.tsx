import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  Dashboard as DashboardIcon,
  Restaurant,
  MenuBook,
  TrendingUp,
  EmojiEvents,
  Person,
  AdminPanelSettings,
  Menu,
  Close,
  Logout,
  LocalFireDepartment,
} from '@mui/icons-material';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/meal-planner', label: 'Meal Planner', icon: Restaurant },
  { path: '/recipes', label: 'Recipes', icon: MenuBook },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/leaderboard', label: 'Leaderboard', icon: EmojiEvents },
  { path: '/profile', label: 'Profile', icon: Person },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="sidebar-header">
          <motion.div 
            className="logo"
            animate={{ scale: sidebarOpen ? 1 : 0.8 }}
          >
            <div className="logo-mark">S</div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="logo-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  SnackTrack
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu />
          </button>
        </div>

        {/* User Info */}
        {user && sidebarOpen && (
          <motion.div 
            className="user-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <div className="user-streak">
                <LocalFireDepartment className="streak-icon" />
                <span>{user.currentStreak || 0} day streak</span>
              </div>
            </div>
          </motion.div>
        )}

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="nav-icon" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <motion.button
            className="nav-item admin-link"
            onClick={() => navigate('/admin')}
            whileHover={{ x: 4 }}
          >
            <AdminPanelSettings className="nav-icon" />
            {sidebarOpen && <span>Admin</span>}
          </motion.button>
          <motion.button
            className="nav-item logout-btn"
            onClick={handleLogout}
            whileHover={{ x: 4 }}
          >
            <Logout className="nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <Close /> : <Menu />}
        </button>
        <div className="mobile-logo">
          <div className="logo-mark-sm">S</div>
          <span>SnackTrack</span>
        </div>
        <div className="mobile-streak">
          <LocalFireDepartment />
          <span>{user?.currentStreak || 0}</span>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.nav
              className="mobile-menu"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button className="mobile-nav-item logout" onClick={handleLogout}>
                <Logout />
                <span>Logout</span>
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-black);
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: var(--color-gray-950);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
          color: #000;
        }

        .logo-mark-sm {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: #000;
        }

        .logo-text {
          font-size: 1.375rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .sidebar-toggle {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: var(--color-gray-500);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          margin: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .user-name {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .user-streak {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--color-gray-500);
        }

        .streak-icon {
          color: #F59E0B;
          font-size: 0.875rem !important;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: transparent;
          border: none;
          color: var(--color-gray-500);
          font-size: 0.9rem;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s;
          overflow: hidden;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .nav-icon {
          font-size: 1.25rem !important;
          min-width: 24px;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 50%;
          background: var(--color-white);
          border-radius: 0 3px 3px 0;
        }

        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .admin-link {
          color: var(--color-gray-600);
          font-size: 0.85rem;
        }

        .logout-btn {
          color: var(--color-gray-600);
        }

        .logout-btn:hover {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--color-gray-950);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: white;
          padding: 0 1rem;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          color: white;
          padding: 0.5rem;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .mobile-streak {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #F59E0B;
          font-size: 0.9rem;
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 200;
        }

        .mobile-menu {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 280px;
          background: var(--color-gray-950);
          padding: 5rem 1rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: none;
          border: none;
          color: var(--color-gray-400);
          font-size: 1rem;
          border-radius: 10px;
          cursor: pointer;
        }

        .mobile-nav-item.active {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .mobile-nav-item.logout {
          margin-top: auto;
          color: #EF4444;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding-top: 60px;
          }
        }

        .sidebar.collapsed + .main-content,
        .sidebar.collapsed ~ .main-content {
          margin-left: 80px;
        }
      `}</style>
    </div>
  );
}
