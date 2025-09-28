import React from 'react';
import { Card } from '@/components/common';
import styles from './Budgets.module.css';

export default function Budgets() {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Budgets</h1>
      <Card>
        <p className={styles.desc}>Monthly budgets with progress bars and alerts when overspent.</p>
      </Card>
    </div>
  );
}
