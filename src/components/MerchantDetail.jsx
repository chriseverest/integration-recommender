import ChurnBadge from './ChurnBadge.jsx'
import styles from './MerchantDetail.module.css'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toString()
}

function partnerUrl(slug, partners) {
  const p = partners.find((p) => p.slug === slug)
  return p?.url ?? `https://loop.partnerpage.io/integrations/${slug}`
}

function IntegrationChip({ name, slug, variant, partners }) {
  const url = partnerUrl(slug, partners)
  const cls = `${styles.chip} ${styles[variant]}`

  if (variant === 'can') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cls} title="View on partnerpage.io">
        {name}
        <ExternalIcon />
      </a>
    )
  }

  return <span className={cls}>{name}</span>
}

function OtherChip({ name }) {
  return <span className={`${styles.chip} ${styles.other}`}>{name}</span>
}

function LogisticsPill({ loc }) {
  if (loc.verdict === 'confirmed_3pl') {
    return (
      <div className={styles.logisticsRow}>
        <span className={`${styles.pill} ${styles.pillPurple}`}>
          Confirmed 3PL · {loc.provider}
        </span>
        <span className={styles.logisticsName}>{loc.name}</span>
        <span className={styles.logisticsAddr}>{loc.address}</span>
      </div>
    )
  }
  if (loc.verdict === 'own_warehouse') {
    return (
      <div className={styles.logisticsRow}>
        <span className={`${styles.pill} ${styles.pillGrey}`}>Own warehouse</span>
        <span className={styles.logisticsName}>{loc.name}</span>
        <span className={styles.logisticsAddr}>{loc.address}</span>
      </div>
    )
  }
  return (
    <div className={styles.logisticsRow}>
      <span className={`${styles.pill} ${styles.pillAmber}`}>Unknown</span>
      <span className={styles.logisticsName}>{loc.name}</span>
      {loc.address && <span className={styles.logisticsAddr}>{loc.address}</span>}
    </div>
  )
}

export default function MerchantDetail({ merchant: m, partners, onClose }) {
  const isConfirmedChurn = m.churn_risk === 'Confirmed Churn'

  return (
    <div className={styles.panel}>
      {isConfirmedChurn && (
        <div className={styles.churnWarning}>
          <WarningIcon />
          <div>
            <strong>Confirmed Churn</strong>
            {m.churn_risk_explanation && (
              <span> — {m.churn_risk_explanation}</span>
            )}
          </div>
        </div>
      )}

      <div className={styles.panelHeader}>
        <div className={styles.panelMeta}>
          <div className={styles.panelNameRow}>
            <h2 className={styles.panelName}>{m.name}</h2>
            <ChurnBadge risk={m.churn_risk} />
          </div>
          <div className={styles.panelSub}>
            <span>{m.segment}</span>
            <span className={styles.dot}>·</span>
            <span>{m.vertical}</span>
            <span className={styles.dot}>·</span>
            <a href={`https://${m.domain}`} target="_blank" rel="noopener noreferrer" className={styles.domain}>
              {m.domain} ↗
            </a>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.stats}>
        <Stat label="TTM Orders" value={fmt(m.ttm_orders)} />
        <Stat label="CSM" value={m.csm} />
        <Stat label="Renewal" value={m.renewal_date} />
        {!m.scan_ok && (
          <span className={styles.scanWarn}>⚠ Scan incomplete</span>
        )}
      </div>

      {m.churn_risk === 'High' && m.churn_risk_explanation && (
        <div className={styles.churnNote}>
          <strong>Risk:</strong> {m.churn_risk_explanation}
        </div>
      )}

      <div className={styles.sections}>
        <Section
          icon="🎯"
          title="Can Connect"
          empty="No recommendations"
          count={m.can_connect.length}
        >
          {m.can_connect.map((p) => (
            <IntegrationChip key={p.slug} name={p.name} slug={p.slug} variant="can" partners={partners} />
          ))}
        </Section>

        <Section
          icon="✅"
          title="Already Connected"
          empty="None connected"
          count={m.already_connected.length}
        >
          {m.already_connected.map((p) => (
            <IntegrationChip key={p.slug} name={p.name} slug={p.slug} variant="connected" partners={partners} />
          ))}
        </Section>

        <Section
          icon="◌"
          title="Other Tools Detected"
          empty="None detected"
          count={m.other_tools_detected.length}
        >
          {m.other_tools_detected.map((name) => (
            <OtherChip key={name} name={name} />
          ))}
        </Section>

        <Section
          icon="📦"
          title="Return Logistics"
          empty="No logistics data"
          count={m.logistics.length}
        >
          <div className={styles.logisticsList}>
            {m.logistics.map((loc, i) => (
              <LogisticsPill key={i} loc={loc} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ icon, title, count, empty, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>{icon}</span>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.sectionCount}>{count}</span>
      </div>
      {count === 0 ? (
        <p className={styles.sectionEmpty}>{empty}</p>
      ) : (
        <div className={styles.chipRow}>{children}</div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}

function ExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5.5 1.5H8.5V4.5M8.5 1.5L4 6M2 3H1.5A.5.5 0 001 3.5v5A.5.5 0 001.5 9h5a.5.5 0 00.5-.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
