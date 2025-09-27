import React from 'react'
import styles from './Card.module.css'
import layout from '@/styles/layout.module.css'

const Card: React.FC<{ title?: string; className?: string; children?: React.ReactNode }> = ({ title, className, children }) => (
  <div className={`${layout.cardBase} ${className || ''}`}>
    {title && <h3 className={styles.title}>{title}</h3>}
    <div>{children}</div>
  </div>
)

export default Card
