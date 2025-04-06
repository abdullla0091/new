import Head from 'next/head';
import styles from '@/styles/Profile.module.css'; // Import styles

export default function ProfilePage() {
  // Placeholder user data - replace with actual data fetching/auth state later
  const user = {
    username: 'User123',
    email: 'user@example.com',
  };

  const handleLogout = () => {
    // Placeholder logout logic
    alert('Logout functionality not implemented yet.');
  };

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile page" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile</h1>

        <div className={styles.infoSection}>
          <span className={styles.infoLabel}>Username:</span>
          <span>{user.username}</span>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.infoLabel}>Email:</span>
          <span>{user.email}</span>
        </div>

        {/* Add more profile elements here (e.g., avatar, edit button) */}

        <button onClick={handleLogout} className={styles.logoutButton}>
          Log Out
        </button>
      </div>
    </>
  );
}
