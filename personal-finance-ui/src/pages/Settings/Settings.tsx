import React, { useState } from 'react';
import { CurrencySettings } from '@/features/settings/CurrencySettings';
import styles from './Settings.module.css';

export default function Settings() {
  const [active, setActive] = useState<'general' | 'currency' | 'notifications'>('currency');

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Settings</h1>
          <p className={styles.headerSubtitle}>Manage your application preferences and account settings.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btnNeutral">Reset to defaults</button>
          <button className="btn btnPrimary">Save changes</button>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.grid}>
          <nav aria-label="Settings navigation" className={styles.nav}>
            <ul className={styles.navList}>
              <li><button onClick={() => setActive('general')} className={`${styles.navBtn} ${active === 'general' ? styles.navBtnActive : styles.navBtnInactive}`}>General</button></li>
              <li><button onClick={() => setActive('currency')} className={`${styles.navBtn} ${active === 'currency' ? styles.navBtnActive : styles.navBtnInactive}`}>Currency</button></li>
              <li><button onClick={() => setActive('notifications')} className={`${styles.navBtn} ${active === 'notifications' ? styles.navBtnActive : styles.navBtnInactive}`}>Notifications</button></li>
            </ul>
          </nav>
          <div className={styles.content}>
            {active === 'currency' && (<section><CurrencySettings /></section>)}
            {active === 'general' && (
              <section aria-labelledby="general-heading">
                <h2 id="general-heading" className={styles.sectionTitle}>General</h2>
                <div className={styles.muted}>Application-wide settings such as language, timezone and startup preferences will appear here.</div>
              </section>
            )}
            {active === 'notifications' && (
              <section aria-labelledby="notifications-heading">
                <h2 id="notifications-heading" className={styles.sectionTitle}>Notifications</h2>
                <div className={styles.muted}>Configure notification preferences (email, push, reminders) here.</div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
