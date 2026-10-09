export const ksh = (n) => `KSh ${Math.round(n).toLocaleString('en-KE')}`

export const optionKey = (sel = {}) =>
  Object.keys(sel).sort().map((k) => `${k}:${[].concat(sel[k]).sort().join('+')}`).join('|')

export function unitPrice(item, sel = {}) {
  let p = item.price
  for (const g of item.options || []) {
    const picked = [].concat(sel[g.id] || [])
    for (const c of g.choices) if (picked.includes(c.id)) p += c.price
  }
  return p
}

export function describeOptions(item, sel = {}) {
  const out = []
  for (const g of item.options || []) {
    const picked = [].concat(sel[g.id] || [])
    for (const c of g.choices) if (picked.includes(c.id)) out.push(c.name)
  }
  return out.join(' · ')
}

export const defaultSelection = (item) => {
  const sel = {}
  for (const g of item.options || []) if (g.type === 'single') sel[g.id] = g.choices[0].id
  return sel
}

export const uid = (p = '') => p + Math.random().toString(36).slice(2, 8).toUpperCase()
