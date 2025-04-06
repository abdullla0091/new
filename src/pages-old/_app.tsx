import "@/styles/globals.css"; // Keep global styles
import styles from "@/styles/AppLayout.module.css"; // Create a new CSS module for layout
import type { AppProps } from "next/app";
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter to determine active path
import { useEffect, useState } from "react";

// Placeholder Icons
const ChatIcon = () => <span>💬</span>;
const ExploreIcon = () => <span>🧭</span>;
const ProfileIcon = () => <span>👤</span>;
const SettingsIcon = () => <span>⚙️</span>;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home'); // Default to home

  // Update active tab based on current route
  useEffect(() => {
    if (router.pathname === '/') {
      setActiveTab('home');
    } else if (router.pathname.startsWith('/chat')) {
      // Keep 'home' active even when in chat? Or add a dedicated chat icon?
      // For now, let's keep home active. Adjust if needed.
      setActiveTab('home');
    } else if (router.pathname === '/explore') {
      setActiveTab('explore');
    } else if (router.pathname === '/profile') { // Placeholder paths
      setActiveTab('profile');
    } else if (router.pathname === '/settings') { // Placeholder paths
      setActiveTab('settings');
    }
  }, [router.pathname]);


  return (
    <div className={styles.appContainer}>
      {/* Main content area - the page component will render here */}
      <div className={styles.mainContent}>
        <Component {...pageProps} />
      </div>

      {/* Bottom Navigation Bar - Use Links */}
      <nav className={styles.bottomNav}>
        <Link href="/" passHref legacyBehavior>
          <a className={`${styles.navButton} ${activeTab === 'home' ? styles.active : ''}`} aria-label="Home">
            <ChatIcon /> {/* Using Chat icon for Home for now */}
            <span>Home</span>
          </a>
        </Link>
        <Link href="/explore" passHref legacyBehavior>
          <a className={`${styles.navButton} ${activeTab === 'explore' ? styles.active : ''}`} aria-label="Explore">
            <ExploreIcon />
            <span>Explore</span>
          </a>
        </Link>
        {/* Updated Links for Profile/Settings */}
        <Link href="/profile" passHref legacyBehavior>
          <a className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`} aria-label="Profile">
            <ProfileIcon />
            <span>Profile</span>
          </a>
        </Link>
        <Link href="/settings" passHref legacyBehavior>
          <a className={`${styles.navButton} ${activeTab === 'settings' ? styles.active : ''}`} aria-label="Settings">
            <SettingsIcon />
            <span>Settings</span>
          </a>
        </Link>
      </nav>
    </div>
  );
}
