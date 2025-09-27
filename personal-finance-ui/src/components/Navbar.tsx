import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/auth";
import { clearUser } from "../state/slices/userSlice";
import { RootState } from "../state/store";
import { useUser } from "../context/UserContext";
import styles from './Navbar.module.css';

export default function Navbar(): JSX.Element {
  const { user, isAuthenticated } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear Redux state
      dispatch(clearUser());
      
      // Perform Auth0 logout
      await logout();
      
      // Note: logout() will redirect to Auth0 logout page, so we don't need to navigate here
    } catch (error) {
      console.error("Logout failed:", error);
      // If logout fails, at least navigate to login
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" className={styles.brand}>
            Finance
          </Link>
          {isAuthenticated && (
            <nav className={styles.navLinks}>
              <Link to="/accounts">Accounts</Link>
              <Link to="/transactions">Transactions</Link>
              <Link to="/budgets">Budgets</Link>
              <Link to="/reports">Reports</Link>
            </nav>
          )}
        </div>

        {isAuthenticated && (
          <div className={styles.userArea}>
            {user && (
              <span className={styles.userName}>
                {user.displayName ?? user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`${styles.logoutBtn} ${isLoggingOut ? 'disabled' : ''}`}
            >
              {isLoggingOut ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className={styles.spinner} />
                  Logging out...
                </div>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
