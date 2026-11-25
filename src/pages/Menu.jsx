import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Leaf, Flame, Star } from 'lucide-react'
import MenuCard from '../components/MenuCard'
import SmartImage from '../components/SmartImage'
import { categories, menu } from '../data/menu'
import { useUI } from '../store'

const filters = [
  { id: 'popular', label: 'Bestsellers', Icon: Star },
  { id: 'veg', label: 'Vegetarian', Icon: Leaf },
  { id: 'spicy', label: 'Spicy', Icon: Flame },
]

export default function Menu() {
  const [params] = useSearchParams()
  const openItem = useUI((s) => s.openItem)
  const [q, setQ] = useState(params.get('q') || '')
  const [tag, setTag] = useState(null)
  const [active, setActive] = useState(params.get('cat') || categories[0].id)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return menu.filter((m) => (!tag || m.tags?.includes(tag)) && (!s || (m.name + ' ' + m.desc).toLowerCase().includes(s)))
  }, [q, tag])

  const groups = categories.map((c) => ({ ...c, items: filtered.filter((m) => m.cat === c.id) })).filter((g) => g.items.length)

  const urlQ = params.get('q') || ''
  const [lastQ, setLastQ] = useState(urlQ)
  if (urlQ !== lastQ) { setLastQ(urlQ); setQ(urlQ) }

  // jump to ?cat= on load
  useEffect(() => {
    const c = params.get('cat')
    if (c) setTimeout(() => jump(c), 300)
  }, [params])

  // scroll-spy
  useEffect(() => {
    const els = groups.map((g) => document.getElementById(`cat-${g.id}`)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (vis) setActive(vis.target.id.replace('cat-', ''))
    }, { rootMargin: '-140px 0px -60% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [groups.length, q, tag]) // eslint-disable-line

  // keep the active chip visible in the horizontal rail (mobile)
  const railRef = useRef(null)
  const barRef = useRef(null)
  useEffect(() => {
    const rail = railRef.current, el = rail?.querySelector(`[data-cat="${active}"]`)
    if (rail && el && rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: el.offsetLeft - rail.offsetLeft - 8, behavior: 'smooth' })
  }, [active])

  // Scroll so the section heading lands just below whatever is stuck to the top
  // (header + category rail on mobile, header only on desktop).
  function jump(id) {
    const el = document.getElementById(`cat-${id}`), bar = barRef.current
    if (!el) return
    const off = () => (window.innerWidth >= 1024 || !bar ? 96 : parseFloat(getComputedStyle(bar).top) + bar.offsetHeight + 12)
    const target = () => el.getBoundingClientRect().top + window.scrollY - off()
    window.scrollTo({ top: target(), behavior: 'smooth' })
    // Cards above may still be settling their layout animation while we scroll, which
    // moves the section. Once scrolling stops, nudge it back into place.
    const settle = () => { if (Math.abs(target() - window.scrollY) > 4) window.scrollTo({ top: target(), behavior: 'smooth' }) }
    if ('onscrollend' in window) window.addEventListener('scrollend', settle, { once: true })
    else setTimeout(settle, 900)
  }

  return (
    <div className="container-x pb-24 pt-8">
      <div className="flex flex-col gap-5 border-b border-bean/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">{menu.length} items · made to order</div>
          <h1 className="mt-2 font-display text-6xl sm:text-7xl">The menu</h1>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bean/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lattes, burgers, chai…" className="field py-3.5 pl-12 pr-12" aria-label="Search menu" />
          {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg hover:bg-cream" aria-label="Clear search"><X className="h-4 w-4" /></button>}
        </div>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* categories: sidebar on desktop, chip rail on mobile */}
        <aside ref={barRef} className="sticky top-[116px] z-30 -mx-4 bg-cream/95 px-4 py-3 backdrop-blur md:top-16 lg:top-24 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <nav ref={railRef} className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-0.5" aria-label="Menu categories">
            {categories.map((c) => {
              const has = groups.some((g) => g.id === c.id)
              const n = groups.find((g) => g.id === c.id)?.items.length || 0
              const on = active === c.id
              return (
                <button key={c.id} data-cat={c.id} onClick={() => jump(c.id)} disabled={!has}
                  className={`relative flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition disabled:opacity-30 lg:py-2.5 ${on ? 'text-white' : 'bg-white ring-1 ring-bean/10 hover:ring-bean/30 lg:bg-transparent lg:ring-0 lg:hover:bg-white'}`}>
                  {on && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-lg bg-bean" transition={{ type: 'spring', damping: 30, stiffness: 400 }} />}
                  <span className="relative">{c.name}</span>
                  <span className={`relative hidden font-mono text-xs lg:inline ${on ? 'text-honey' : 'text-bean/40'}`}>{n}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-3 flex flex-wrap gap-1.5 lg:mt-6 lg:border-t lg:border-bean/10 lg:pt-6">
            <span className="eyebrow hidden w-full pb-1 lg:block">Filter</span>
            {filters.map((f) => (
              <button key={f.id} onClick={() => setTag(tag === f.id ? null : f.id)} aria-pressed={tag === f.id}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition ${tag === f.id ? 'bg-honey text-bean' : 'bg-cream-200 text-bean/70 hover:bg-cream-300'}`}>
                <f.Icon className="h-3.5 w-3.5" />{f.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          {groups.length === 0 && (
            <div className="py-24 text-center">
              <h3 className="font-display text-5xl">Nothing matches “{q}”</h3>
              <p className="mt-3 text-bean/60">Try “latte”, “chicken” or “pancakes”.</p>
              <button className="btn-dark mt-6" onClick={() => { setQ(''); setTag(null) }}>Clear search</button>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {groups.map((g, gi) => (
              <motion.section layout key={g.id} id={`cat-${g.id}`} className="scroll-mt-60 pb-10 md:scroll-mt-48 lg:scroll-mt-28">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="eyebrow">{String(gi + 1).padStart(2, '0')} · {g.blurb}</div>
                    <h2 className="mt-1 font-display text-4xl sm:text-5xl">{g.name}</h2>
                  </div>
                  <SmartImage src={g.img.replace('w=400', 'w=160')} alt="" className="hidden h-14 w-14 rounded-xl object-cover sm:block" />
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {g.items.map((m, i) => <MenuCard key={m.id} item={m} onOpen={openItem} i={i} row />)}
                  </AnimatePresence>
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
