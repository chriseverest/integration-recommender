import { formatFullNumber, salesforceAccountUrl } from '../lib/format.js'
import styles from './MerchantBreakdown.module.css'

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5.5 1.5H8.5V4.5M8.5 1.5L4 6M2 3H1.5A.5.5 0 001 3.5v5A.5.5 0 001.5 9h5a.5.5 0 00.5-.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PillNone({ children }) {
  return <span className={styles.pillNone}>{children ?? 'none'}</span>
}

export default function MerchantBreakdown({ merchant: m }) {
  const domainHref = m.domain ? `https://${String(m.domain).replace(/^https?:\/\//, '')}` : null
  const sfUrl = salesforceAccountUrl(m.sf_id)
  const hasServices = m.active_services && String(m.active_services).trim() !== ''
  const activeServices = hasServices
    ? `${m.active_services} (count: ${m.active_count ?? 0})`
    : `none (count: ${m.active_count ?? 0})`

  return (
    <div className={styles.wrap}>
      <dl className={styles.kv}>
        <dt>Domain</dt>
        <dd className={styles.domainRow}>
          {domainHref && (
            <a href={domainHref} target="_blank" rel="noopener noreferrer" className={styles.extLink}>
              {m.domain}
              <ExternalIcon />
            </a>
          )}
          {sfUrl && (
            <a href={sfUrl} target="_blank" rel="noopener noreferrer" className={styles.extLink}>
              Salesforce
              <ExternalIcon />
            </a>
          )}
        </dd>

        <dt>Vertical · Segment</dt>
        <dd>
          {m.vertical ?? '—'} · {m.segment ?? '—'}
        </dd>

        <dt>TTM Orders</dt>
        <dd>{formatFullNumber(m.ttm)}</dd>

        <dt>Loop Active Services</dt>
        <dd>{activeServices}</dd>

        <dt>Account owner</dt>
        <dd>{m.csm ?? '—'}</dd>
      </dl>

      <div className={styles.sections}>
        <section className={styles.block}>
          <h3 className={styles.blockTitle}>
            <span>🎯</span> CAN CONNECT
          </h3>
          <div className={styles.pillRow}>
            {m.can_connect?.length > 0
              ? m.can_connect.map((p) => (
                  <a key={p.url + p.name} href={p.url} target="_blank" rel="noopener noreferrer" className={styles.canPill}>
                    {p.name}
                  </a>
                ))
              : <PillNone />}
          </div>
        </section>

        <section className={styles.block}>
          <h3 className={styles.blockTitle}>
            <span>✅</span> ALREADY CONNECTED
          </h3>
          <div className={styles.pillRow}>
            {m.already_connected?.length > 0
              ? m.already_connected.map((name) => (
                  <span key={name} className={styles.connPill}>
                    {name}
                  </span>
                ))
              : <PillNone />}
          </div>
        </section>

        <section className={styles.block}>
          <h3 className={styles.blockTitle}>OTHER TOOLS DETECTED</h3>
          <div className={styles.pillRow}>
            {m.other_detected?.length > 0
              ? m.other_detected.map((t) => (
                  <span key={t.name + t.category} className={styles.otherPill} title={t.category}>
                    {t.name}
                  </span>
                ))
              : <PillNone />}
          </div>
        </section>

        <section className={styles.block}>
          <h3 className={styles.blockTitle}>
            <span>🚚</span> RETURN LOGISTICS (3PL/WMS)
          </h3>
          <div className={styles.pillRow}>
            {m.threepl?.length > 0
              ? m.threepl.map((name) => (
                  <span key={name} className={styles.tplPill}>
                    {name}
                  </span>
                ))
              : <span className={styles.no3pl}>no 3PL identified</span>}
          </div>
        </section>
      </div>

      <p className={styles.footer}>
        Scanned {m.scan_pages ?? 0} pages · detected {m.stack_count ?? 0} tools.
        {!m.dest_known && <span> · destinations not on file</span>}
      </p>
    </div>
  )
}
