import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>Dashboard</Link>
          <Link to="/accounts" className={styles.link}>Accounts</Link>
          <Link to="/transactions" className={styles.link}>Transactions</Link>
          <Link to="/categories" className={styles.link}>Categories</Link>
          <Link to="/budgets" className={styles.link}>Budgets</Link>
          <Link to="/reports" className={styles.link}>Reports</Link>
          <Link to="/settings" className={styles.link}>Settings</Link>
        </nav>
      </div>
    </aside>
  )
}
