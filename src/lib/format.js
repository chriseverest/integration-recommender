export function formatCompactNumber(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 100_000) return Math.round(n / 1_000).toLocaleString() + 'K'
  if (n >= 10_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toLocaleString()
}

export function formatFullNumber(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  return n.toLocaleString()
}

export function formatGeneratedAt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (x) => String(x).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  )
}

export function salesforceAccountUrl(sfId) {
  if (!sfId) return null
  return `https://lightning.force.com/lightning/r/Account/${encodeURIComponent(sfId)}/view`
}
