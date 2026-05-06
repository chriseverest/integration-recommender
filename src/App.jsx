import { useState, useMemo } from 'react'
import merchantsData from '../merchants.json'
import MerchantList from './components/MerchantList.jsx'
import MerchantDetail from './components/MerchantDetail.jsx'
import Filters from './components/Filters.jsx'
import styles from './App.module.css'

const SEGMENT_FILTERS = ['Enterprise', 'Mid-Market']
const CHURN_FILTERS = ['High', 'Low', 'Confirmed Churn', 'None']

export default function App() {
  const [search, setSearch] = useState('')
  const [activeSegments, setActiveSegments] = useState(new Set())
  const [activeChurns, setActiveChurns] = useState(new Set())
  const [selectedMerchant, setSelectedMerchant] = useState(null)

  const merchants = merchantsData.merchants

  const filtered = useMemo(() => {
    return merchants.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
      if (activeSegments.size > 0 && !activeSegments.has(m.segment)) return false
      if (activeChurns.size > 0) {
        const churnLabel = m.churn_risk === null ? 'None' : m.churn_risk
        if (!activeChurns.has(churnLabel)) return false
      }
      return true
    })
  }, [merchants, search, activeSegments, activeChurns])

  function toggleSet(set, setSet, value) {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setSet(next)
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#2B33FF"/>
              <path d="M7 7h4v10H7zM13 7h4v6h-4z" fill="white"/>
            </svg>
            <span className={styles.logoText}>Loop</span>
          </div>
          <h1 className={styles.title}>Integration Recommender</h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.searchWrap}>
            <SearchIcon />
            <input
              className={styles.search}
              type="text"
              placeholder="Search merchants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>

          <Filters
            label="Segment"
            options={SEGMENT_FILTERS}
            active={activeSegments}
            onToggle={(v) => toggleSet(activeSegments, setActiveSegments, v)}
          />
          <Filters
            label="Churn Risk"
            options={CHURN_FILTERS}
            active={activeChurns}
            onToggle={(v) => toggleSet(activeChurns, setActiveChurns, v)}
          />

          <p className={styles.count}>
            {filtered.length} merchant{filtered.length !== 1 ? 's' : ''}
          </p>

          <MerchantList
            merchants={filtered}
            partners={merchantsData.partners}
            selected={selectedMerchant}
            onSelect={setSelectedMerchant}
          />
        </div>

        <div className={styles.detail}>
          {selectedMerchant ? (
            <MerchantDetail
              merchant={selectedMerchant}
              partners={merchantsData.partners}
              onClose={() => setSelectedMerchant(null)}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="#9B9BA4" strokeWidth="1.5"/>
      <path d="M10.5 10.5L13 13" stroke="#9B9BA4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="8" fill="#E5E5E7"/>
        <path d="M16 20h16M16 24h12M16 28h8" stroke="#9B9BA4" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p>Select a merchant to view integration recommendations</p>
    </div>
  )
}
