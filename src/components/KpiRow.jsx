import styles from './KpiRow.module.css'

export default function KpiRow({ kpis }) {
  const cards = [
    { label: 'Merchants shown', emphasize: 'default', value: kpis.merchantsShown },
    { label: 'High churn risk', emphasize: 'red', value: kpis.highChurn },
    { label: 'Low churn risk', emphasize: 'amber', value: kpis.lowChurn },
    { label: 'Have ≥1 actionable connect', emphasize: 'green', value: kpis.actionableConnect },
    { label: '3PL identified', emphasize: 'purple', value: kpis.threeplIdentified },
    { label: 'Storefront scanned', emphasize: 'default', value: kpis.storefrontScanned },
  ]

  return (
    <div className={styles.row}>
      {cards.map((c) => (
        <div key={c.label} className={styles.card}>
          <span className={styles.valueWrap}>
            <span className={`${styles.value} ${styles[c.emphasize] ?? ''}`}>{c.value.toLocaleString()}</span>
          </span>
          <span className={styles.label}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}
