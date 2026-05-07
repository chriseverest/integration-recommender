import { useMemo, useState, useEffect } from 'react'
import database from '../integration-recommender-database.json'
import KpiRow from './components/KpiRow.jsx'
import FilterBar from './components/FilterBar.jsx'
import MerchantTable from './components/MerchantTable.jsx'
import {
  filterMerchants,
  sortByTtm,
  uniqueSorted,
  computeKpis,
} from './lib/merchantsFilter.js'
import { formatGeneratedAt } from './lib/format.js'
import styles from './App.module.css'

const PAGE_SIZE = 50

const initialFilter = () => ({
  search: '',
  churn: 'all',
  minTtm: 0,
  vertical: 'all',
  csm: 'all',
  onlyActionable: false,
  only3pl: false,
})

export default function App() {
  const merchants = database.merchants
  const scanProgress = database.scan_progress
  const generatedAt = database.generated_at

  const verticalOptions = useMemo(() => uniqueSorted(merchants.map((m) => m.vertical)), [merchants])
  const csmOptions = useMemo(() => uniqueSorted(merchants.map((m) => m.csm)), [merchants])

  const [filter, setFilter] = useState(initialFilter)
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)

  const filtered = useMemo(() => filterMerchants(merchants, filter), [merchants, filter])
  const sorted = useMemo(() => sortByTtm(filtered, sortDir), [filtered, sortDir])
  const kpis = useMemo(() => computeKpis(filtered), [filtered])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [filter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    setExpandedId(null)
  }, [filter])

  function resetFilters() {
    setFilter(initialFilter())
    setSortDir('desc')
    setExpandedId(null)
  }

  function toggleSort() {
    setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
  }

  const subtitleCount = scanProgress?.total ?? merchants.length
  const scannedRatio = scanProgress
    ? `${scanProgress.scanned.toLocaleString()}/${scanProgress.total.toLocaleString()}`
    : ''

  const pageLabel = `${sorted.length.toLocaleString()} merchants · page ${page} / ${totalPages}`

  return (
    <div className={styles.layout}>
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <div>
            <h1 className={styles.title}>Integration Recommender · Database</h1>
            <p className={styles.subtitle}>
              {subtitleCount.toLocaleString()} active Loop customers · current integrations + storefront stack + 3PL/WMS +
              actionable connect plays
            </p>
          </div>
          <div className={styles.meta}>
            <span className={styles.metaLine}>Generated {formatGeneratedAt(generatedAt)}</span>
            {scannedRatio && (
              <span className={styles.metaLine}>
                Storefronts scanned: {scannedRatio}
              </span>
            )}
            <span className={styles.hint}>To refresh, type &quot;refresh integration recommender&quot; in chat</span>
          </div>
        </div>
        <KpiRow kpis={kpis} />
        <FilterBar
          search={filter.search}
          onSearch={(search) => setFilter((f) => ({ ...f, search }))}
          churn={filter.churn}
          onChurn={(churn) => setFilter((f) => ({ ...f, churn }))}
          minTtm={filter.minTtm}
          onMinTtm={(minTtm) => setFilter((f) => ({ ...f, minTtm }))}
          vertical={filter.vertical}
          onVertical={(vertical) => setFilter((f) => ({ ...f, vertical }))}
          verticalOptions={verticalOptions}
          csm={filter.csm}
          onCsm={(csm) => setFilter((f) => ({ ...f, csm }))}
          csmOptions={csmOptions}
          onlyActionable={filter.onlyActionable}
          onOnlyActionable={(onlyActionable) => setFilter((f) => ({ ...f, onlyActionable }))}
          only3pl={filter.only3pl}
          onOnly3pl={(only3pl) => setFilter((f) => ({ ...f, only3pl }))}
          onReset={resetFilters}
          pageLabel={pageLabel}
        />
      </header>

      <main className={styles.main}>
        <MerchantTable
          merchants={sorted}
          expandedId={expandedId}
          onToggleExpand={setExpandedId}
          sortDir={sortDir}
          onToggleSort={toggleSort}
          page={page}
          pageSize={PAGE_SIZE}
          totalFiltered={sorted.length}
        />
        {sorted.length > 0 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className={styles.pageStatus}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </nav>
        )}
      </main>
    </div>
  )
}
