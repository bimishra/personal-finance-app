import React from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  layer?: 'base' | 'top';
}

export default function Modal({ open, onClose, title, children, layer = 'base' }: ModalProps) {
  if (!open) return null
  return (
    <div className={`${styles.backdrop} ${layer === 'top' ? styles.backdropTop : ''}`}> 
      <div className={styles.center}>
        <div className={styles.overlay}></div>
        <div className={styles.panel}>
          <div className={styles.content}>
            <div className={styles.headerRow}>
              <h3 className={styles.title}>{title}</h3>
              <button
                onClick={onClose}
                className={styles.closeBtn}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
