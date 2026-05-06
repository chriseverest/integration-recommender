import styles from './Filters.module.css'

export default function Filters({ label, options, active, onToggle }) {
  return (
    <div className={styles.group}>
      <p className={styles.label}>{label}</p>
      <div className={styles.chips}>
        {options.map((opt) => (
          <button
            key={opt}
            className={`${styles.chip} ${active.has(opt) ? styles.active : ''}`}
            onClick={() => onToggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
