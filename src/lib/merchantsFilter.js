function churnKey(risk) {
  if (risk == null || risk === '') return 'None'
  return risk
}

export function filterMerchants(merchants, f) {
  const search = f.search.trim().toLowerCase()
  const searchTokens = search ? search.split(/\s+/).filter(Boolean) : []

  return merchants.filter((m) => {
    if (f.churn !== 'all') {
      if (churnKey(m.risk) !== f.churn) return false
    }
    if ((m.ttm ?? 0) < f.minTtm) return false
    if (f.vertical !== 'all' && m.vertical !== f.vertical) return false
    if (f.csm !== 'all' && m.csm !== f.csm) return false
    if (f.onlyActionable && !(m.can_connect?.length > 0)) return false
    if (f.only3pl && !(m.threepl?.length > 0)) return false

    if (searchTokens.length > 0) {
      const blob = [
        m.name,
        m.domain,
        m.vertical,
        m.segment,
        m.csm,
        m.sf_id,
        ...(m.can_connect ?? []).map((x) => x.name),
        ...(m.already_connected ?? []),
        ...(m.threepl ?? []),
        ...(m.other_detected ?? []).map((x) => `${x.name} ${x.category ?? ''}`),
        m.active_services,
      ]
        .filter(Boolean)
        .join(' \n ')
        .toLowerCase()
      const ok = searchTokens.every((t) => blob.includes(t))
      if (!ok) return false
    }

    return true
  })
}

export function sortByTtm(merchants, dir) {
  const mult = dir === 'asc' ? 1 : -1
  return [...merchants].sort((a, b) => mult * ((a.ttm ?? 0) - (b.ttm ?? 0)))
}

export function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

export function computeKpis(merchants) {
  return {
    merchantsShown: merchants.length,
    highChurn: merchants.filter((m) => m.risk === 'High').length,
    lowChurn: merchants.filter((m) => m.risk === 'Low').length,
    actionableConnect: merchants.filter((m) => (m.can_connect?.length ?? 0) > 0).length,
    threeplIdentified: merchants.filter((m) => (m.threepl?.length ?? 0) > 0).length,
    storefrontScanned: merchants.filter((m) => m.scanned).length,
  }
}
