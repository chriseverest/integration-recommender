import styles from './ChurnBadge.module.css'

export default function ChurnBadge({ risk, compact = false }) {
  if (!risk) return null

  const variant = {
    High: 'high',
    Low: 'low',
    'Confirmed Churn': 'confirmed',
  }[risk]

  if (!variant) return null

  return (
    <span className={`${styles.badge} ${styles[variant]} ${compact ? styles.compact : ''}`}>
      {risk === 'Confirmed Churn' && !compact && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
          <path d="M6 4.5v2.5M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )}
      {risk}
    </span>
  )
}
