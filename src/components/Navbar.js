import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './Navbar.module.css'; // Import the CSS module

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className={styles.navContainer}>
      {session ? (
        <>
          <p className={styles.welcomeMessage}>Welcome, {session.user.name}</p>
          <button
            onClick={() => signOut()}
            className={`${styles.button} ${styles.buttonLogout}`}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn('google')}
          className={`${styles.button} ${styles.buttonLogin}`}
        >
          Login with Google
        </button>
      )}
    </nav>
  );
}