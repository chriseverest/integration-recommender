import ChurnBadge from './ChurnBadge.jsx'
import styles from './MerchantList.module.css'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

export default function MerchantList({ merchants, selected, onSelect }) {
  if (merchants.length === 0) {
    return <p className={styles.empty}>No merchants match your filters.</p>
  }

  return (
    <ul className={styles.list}>
      {merchants.map((m) => (
        <li key={m.shop_id}>
          <button
            className={`${styles.card} ${selected?.shop_id === m.shop_id ? styles.selected : ''}`}
            onClick={() => onSelect(m)}
          >
            <div className={styles.cardTop}>
              <span className={styles.name}>{m.name}</span>
              <ChurnBadge risk={m.churn_risk} compact />
            </div>
            <div className={styles.meta}>
              <span className={styles.segment}>{m.segment}</span>
              <span className={styles.dot}>·</span>
              <span>{m.vertical}</span>
              <span className={styles.dot}>·</span>
              <span>{fmt(m.ttm_orders)} orders</span>
            </div>
            <div className={styles.csm}>CSM: {m.csm}</div>
          </button>
        </li>
      ))}
    </ul>
  )
}
