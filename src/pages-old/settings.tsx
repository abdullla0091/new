import Head from 'next/head';
import styles from '@/styles/Settings.module.css'; // Import styles
import { useState } from 'react'; // Import useState for toggle state

export default function SettingsPage() {
  // Placeholder state for settings - replace with actual state management
  const [isDarkMode, setIsDarkMode] = useState(false); // Example state
  const [language, setLanguage] = useState('en'); // Example state

  // Placeholder handlers
  const handleThemeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDarkMode(e.target.checked);
    // Add logic here to actually change the theme (e.g., update context, local storage, class on body)
    console.log('Theme toggled:', e.target.checked ? 'Dark' : 'Light');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // Add logic here to update language preference
    console.log('Language changed:', e.target.value);
  };

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Application settings page" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>

        {/* Dark Mode Toggle */}
        <div className={styles.settingItem}>
          <label htmlFor="themeToggle" className={styles.settingLabel}>
            Dark Mode
          </label>
          <label className={styles.switch}>
            <input
              id="themeToggle"
              type="checkbox"
              checked={isDarkMode}
              onChange={handleThemeToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {/* Language Selection */}
        <div className={styles.settingItem}>
          <label htmlFor="languageSelect" className={styles.settingLabel}>
            Language
          </label>
          <select
            id="languageSelect"
            value={language}
            onChange={handleLanguageChange}
            // Add basic styling or use a styled component library
          >
            <option value="en">English</option>
            <option value="ku">Kurdish</option>
            {/* Add other languages as needed */}
          </select>
        </div>

        {/* Add more settings items here */}

      </div>
    </>
  );
}
