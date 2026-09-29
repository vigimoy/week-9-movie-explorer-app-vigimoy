import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { SearchForm } from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/uiStore';

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Movie Explorer home">
      <Icon name="logo" className="desktop-logo" />
      <Icon name="logo-mobile" className="mobile-logo" />
      <span>Movie</span>
    </Link>
  );
}
export default function Layout() {
  const { pathname, search } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notification = useUiStore((state) => state.notification);
  const clearNotification = useUiStore((state) => state.clearNotification);
  const searchPage = pathname === '/search';
  const cinematicPage = pathname === '/' || pathname.startsWith('/movie/');
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);
  useEffect(() => {
    if (!notification) return;
    const timeout = setTimeout(clearNotification, 3500);
    return () => clearTimeout(timeout);
  }, [notification, clearNotification]);
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled || !cinematicPage ? 'header-solid' : ''} ${searchPage ? 'header-search' : ''}`}
      >
        <div className="page-container header-inner">
          <div className="header-brand">
            <Logo />
            <nav aria-label="Main navigation">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
            </nav>
          </div>
          {searchPage && (
            <Link to="/" className="mobile-back" aria-label="Back to home">
              <ArrowLeft />
            </Link>
          )}
          <div className="header-search-form">
            <SearchForm key={pathname === '/search' ? 'search' : 'other'} autoFocus={searchPage} />
          </div>
          <div className="mobile-actions">
            <Button asChild variant="ghost" size="icon">
              <Link to="/search" aria-label="Open search">
                <Icon name="search-mobile" />
              </Link>
            </Button>
            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Icon name="menu" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="mobile-menu">
                  <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Explore movies and your favorites.
                  </Dialog.Description>
                  <div className="mobile-menu-header">
                    <Logo />
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <nav aria-label="Mobile navigation">
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>
                      Home
                    </NavLink>
                    <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                      Favorites
                    </NavLink>
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="page-container footer-inner">
          <Logo />
          <p>Copyright ©2025 Movie Explorer</p>
        </div>
      </footer>
      <div aria-live="polite" aria-atomic="true" className="toast-region">
        <AnimatePresence>
          {notification && (
            <motion.div
              key={notification.id}
              className="toast"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <CheckCircle2 size={22} />
              <span>{notification.message}</span>
              <button aria-label="Dismiss notification" onClick={clearNotification}>
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
