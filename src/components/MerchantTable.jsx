import { Fragment, useCallback } from 'react'
import ChurnBadge from './ChurnBadge.jsx'
import MerchantBreakdown from './MerchantBreakdown.jsx'
import { formatCompactNumber } from '../lib/format.js'
import styles from './MerchantTable.module.css'

function truncateCsm(name) {
  if (!name) return '—'
  return name.length > 22 ? `${name.slice(0, 20)}…` : name
}

function CanPills({ items }) {
  if (!items?.length) return <span className={styles.nonePill}>none</span>
  return (
    <span className={styles.pillGroup}>
      {items.map((p) => (
        <a
          key={p.url + p.name}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.pillCan}
          onClick={(e) => e.stopPropagation()}
        >
          {p.name}
        </a>
      ))}
    </span>
  )
}

function ConnectedPills({ names }) {
  if (!names?.length) return <span className={styles.nonePill}>none</span>
  return (
    <span className={styles.pillGroup}>
      {names.map((name) => (
        <span key={name} className={styles.pillConnected}>
          {name}
        </span>
      ))}
    </span>
  )
}

function ThreePLCell({ names }) {
  if (!names?.length) {
    return <span className={styles.dashCircle}>—</span>
  }
  return (
    <span className={styles.pillGroup}>
      {names.map((name) => (
        <span key={name} className={styles.pill3pl}>
          {name.length > 26 ? `${name.slice(0, 24)}…` : name}
        </span>
      ))}
    </span>
  )
}

export default function MerchantTable({ merchants, expandedId, onToggleExpand, sortDir, onToggleSort, page, pageSize, totalFiltered }) {
  const start = (page - 1) * pageSize
  const pageRows = merchants.slice(start, start + pageSize)

  const onRowActivate = useCallback(
    (id) => {
      onToggleExpand(expandedId === id ? null : id)
    },
    [expandedId, onToggleExpand],
  )

  if (totalFiltered === 0) {
    return <p className={styles.empty}>No merchants match your filters.</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thMerchant}>Merchant</th>
            <th className={styles.thNum}>
              <button type="button" className={styles.sortBtn} onClick={onToggleSort}>
                TTM
                <span className={styles.sortIcon} aria-hidden>
                  {sortDir === 'desc' ? '↓' : '↑'}
                </span>
              </button>
            </th>
            <th className={styles.thChurn}>Churn</th>
            <th className={styles.thCsm}>Account owner</th>
            <th className={styles.thCan}>
              <span className={styles.thAccent}>🎯</span> CAN CONNECT
            </th>
            <th className={styles.thConn}>
              <span className={styles.thBlue}>✅</span> ALREADY CONNECTED
            </th>
            <th className={styles.th3pl}>
              <span className={styles.thPurple}>🚚</span> 3PL
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((m) => {
            const id = String(m.shop_id)
            const open = expandedId === id
            return (
              <Fragment key={id}>
                <tr
                  className={`${styles.row} ${open ? styles.rowOpen : ''}`}
                  onClick={() => onRowActivate(id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onRowActivate(id)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={open}
                >
                  <td>
                    <div className={styles.merchantCell}>
                      <span className={styles.merchantName}>{m.name}</span>
                      <span className={styles.merchantVert}>{m.vertical ?? '—'}</span>
                    </div>
                  </td>
                  <td className={styles.tdNum}>{formatCompactNumber(m.ttm)}…</td>
                  <td>
                    <ChurnBadge risk={m.risk} compact showPlaceholder />
                  </td>
                  <td className={styles.tdCsm}>{truncateCsm(m.csm)}</td>
                  <td>
                    <CanPills items={m.can_connect} />
                  </td>
                  <td>
                    <ConnectedPills names={m.already_connected} />
                  </td>
                  <td>
                    <ThreePLCell names={m.threepl} />
                  </td>
                </tr>
                {open && (
                  <tr className={styles.detailTr}>
                    <td colSpan={7}>
                      <MerchantBreakdown merchant={m} />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
