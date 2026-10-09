import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { byId } from '../data/menu'
import { optionKey, unitPrice } from '../lib/format'
import { api } from '../lib/api'

export const DELIVERY_FEE = 150
export const FREE_DELIVERY_OVER = 2500

/* ---------------- CART ---------------- */
export const useCart = create(
  persist(
    (set, get) => ({
      lines: [], // { key, id, qty, sel, comboId?, note }
      open: false,
      promo: null,
      setOpen: (open) => set({ open }),
      add: (id, sel = {}, qty = 1, extra = {}) => {
        const key = id + '#' + optionKey(sel) + (extra.comboId ? '#' + extra.comboId : '')
        const lines = [...get().lines]
        const found = lines.find((l) => l.key === key)
        if (found) found.qty += qty
        else lines.push({ key, id, sel, qty, ...extra })
        set({ lines })
      },
      setQty: (key, qty) =>
        set({ lines: get().lines.flatMap((l) => (l.key !== key ? [l] : qty > 0 ? [{ ...l, qty }] : [])) }),
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      clear: () => set({ lines: [], promo: null }),
      applyPromo: (code) => {
        const c = code.trim().toUpperCase()
        const promos = { KARIBU20: { code: 'KARIBU20', pct: 20, label: '20% off your first order' }, CHAI10: { code: 'CHAI10', pct: 10, label: '10% off' } }
        if (promos[c]) { set({ promo: promos[c] }); return true }
        return false
      },
      removePromo: () => set({ promo: null }),
    }),
    { name: 'kc-cart', partialize: (s) => ({ lines: s.lines, promo: s.promo }) }
  )
)

export function cartTotals(lines, promo, mode = 'delivery') {
  const subtotal = lines.reduce((s, l) => {
    const item = byId[l.id]
    if (!item) return s
    return s + (unitPrice(item, l.sel) - (l.discount || 0)) * l.qty
  }, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const discount = promo ? Math.round((subtotal * promo.pct) / 100) : 0
  const delivery = mode === 'delivery' && subtotal > 0 && subtotal - discount < FREE_DELIVERY_OVER ? DELIVERY_FEE : 0
  const total = subtotal - discount + delivery
  return { subtotal, discount, delivery, total, count }
}

/* ---------------- AUTH ---------------- */
// The server is the only source of truth for who is signed in. Nothing about the
// user is kept in localStorage, so it can't be edited in DevTools to fake a login.
export const useAuth = create((set) => ({
  user: null,
  ready: false, // false until we've asked the server "who am I?"
  init: async () => {
    try { localStorage.removeItem('kc-auth') } catch { /* old demo accounts; storage may be blocked */ }
    try {
      const { user } = await api('/api/auth/me')
      set({ user, ready: true })
    } catch {
      set({ user: null, ready: true })
    }
  },
  signup: async ({ name, email, phone, password }) => {
    const { user } = await api('/api/auth/signup', { name, email, phone, password })
    set({ user })
    return user
  },
  login: async ({ email, password }) => {
    const { user } = await api('/api/auth/login', { email, password })
    set({ user })
    return user
  },
  logout: async () => {
    try { await api('/api/auth/logout', {}) } finally { set({ user: null }) }
  },
  // Only name, phone and addresses can be changed — the server ignores anything else.
  update: async (patch) => {
    const { user } = await api('/api/auth/profile', patch)
    set({ user })
    return user
  },
  changePassword: (currentPassword, newPassword) => api('/api/auth/password', { currentPassword, newPassword }),
  forgot: (email) => api('/api/auth/forgot', { email }),
  reset: async (token, password) => {
    const { user } = await api('/api/auth/reset', { token, password })
    set({ user })
    return user
  },
  verify: async (token) => {
    const { user } = await api('/api/auth/verify', { token })
    if (user) set({ user })
  },
  resendVerify: () => api('/api/auth/verify', { resend: true }),
}))

/* ---------------- ORDERS ---------------- */
export const useOrders = create(
  persist(
    (set, get) => ({
      orders: [],
      place: (order) => {
        const o = { ...order, id: 'KC-' + Math.floor(100000 + Math.random() * 900000), createdAt: Date.now() }
        set({ orders: [o, ...get().orders] })
        return o
      },
      get: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'kc-orders' }
  )
)

/* ---------------- UI ---------------- */
export const useUI = create((set) => ({
  item: null,
  openItem: (item) => set({ item }),
  closeItem: () => set({ item: null }),
  toast: null,
  showToast: (msg) => { set({ toast: { msg, id: Date.now() } }); setTimeout(() => set({ toast: null }), 2600) },
}))
