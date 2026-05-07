import styles from './FilterBar.module.css'

const CHURN_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'High', label: 'High' },
  { value: 'Low', label: 'Low' },
  { value: 'None', label: 'None' },
  { value: 'Confirmed Churn', label: 'Confirmed Churn' },
]

export default function FilterBar({
  search,
  onSearch,
  churn,
  onChurn,
  minTtm,
  onMinTtm,
  vertical,
  onVertical,
  verticalOptions,
  csm,
  onCsm,
  csmOptions,
  onlyActionable,
  onOnlyActionable,
  only3pl,
  onOnly3pl,
  onReset,
  pageLabel,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search merchant, domain, tool, partner, or 3PL…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search merchants"
        />

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Churn risk</span>
          <select className={styles.select} value={churn} onChange={(e) => onChurn(e.target.value)}>
            {CHURN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Min TTM</span>
          <input
            className={styles.number}
            type="number"
            min={0}
            step={1}
            value={minTtm}
            onChange={(e) => onMinTtm(Number(e.target.value) || 0)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Vertical</span>
          <select className={styles.select} value={vertical} onChange={(e) => onVertical(e.target.value)}>
            <option value="all">All</option>
            {verticalOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Account owner</span>
          <select className={styles.select} value={csm} onChange={(e) => onCsm(e.target.value)}>
            <option value="all">All</option>
            {csmOptions.map((c) => (
              <option key={c} value={c}>
                {c.length > 28 ? `${c.slice(0, 26)}…` : c}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.check}>
          <input type="checkbox" checked={onlyActionable} onChange={(e) => onOnlyActionable(e.target.checked)} />
          <span>Only with actionable connects</span>
        </label>

        <label className={styles.check}>
          <input type="checkbox" checked={only3pl} onChange={(e) => onOnly3pl(e.target.checked)} />
          <span>Only with 3PL identified</span>
        </label>

        <button type="button" className={styles.reset} onClick={onReset}>
          Reset
        </button>
      </div>
      <p className={styles.pageMeta}>{pageLabel}</p>
    </div>
  )
}
