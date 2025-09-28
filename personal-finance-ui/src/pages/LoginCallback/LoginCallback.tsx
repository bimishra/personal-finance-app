import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initAuth, handleRedirectCallback } from '@/services/auth';
import { useUser } from '@/context/UserContext';
import styles from '../LoginCallback.module.css';

export default function LoginCallback() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing) return; setIsProcessing(true);
      try {
        await initAuth();
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          const { isAuthenticated } = await import('@/services/auth');
          const alreadyAuth = await isAuthenticated();
          if (alreadyAuth) { await fetchUser(); navigate('/dashboard', { replace: true }); }
          else { await handleRedirectCallback(); await fetchUser(); navigate('/dashboard', { replace: true }); }
        } else { navigate('/login', { replace: true }); }
      } catch (e:any) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes('Invalid state')) { setError('Authentication failed. Please try logging in again.'); setTimeout(() => navigate('/login', { replace: true }), 3000); }
        else navigate('/login', { replace: true });
      } finally { setIsProcessing(false); }
    };
    handleCallback();
  }, [navigate, fetchUser, isProcessing]);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        {error ? (
          <>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorHeading}>Authentication Error</h2>
            <p className={styles.errorText}>{error}</p>
            <p className={styles.smallMuted}>Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className={`spinner ${styles.spinner}`} aria-hidden="true"></div>
            <h2 className={styles.title}>Completing sign in...</h2>
            <p className={styles.subtitle}>Please wait while we set up your account.</p>
          </>
        )}
      </div>
    </div>
  );
}
