import { useEffect, useMemo, useState } from 'react'
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
  const [q, setQ] = useState('')
  const [tag, setTag] = useState(null)
  const [active, setActive] = useState(params.get('cat') || categories[0].id)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return menu.filter((m) => (!tag || m.tags?.includes(tag)) && (!s || (m.name + ' ' + m.desc).toLowerCase().includes(s)))
  }, [q, tag])

  const groups = categories.map((c) => ({ ...c, items: filtered.filter((m) => m.cat === c.id) })).filter((g) => g.items.length)

  // jump to ?cat= on load
  useEffect(() => {
    const c = params.get('cat')
    if (c) setTimeout(() => document.getElementById(`cat-${c}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
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

  const jump = (id) => document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="container-x pb-10 pt-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-5xl font-black sm:text-6xl">The menu</h1>
          <p className="mt-2 text-lg text-bean/60">Tap anything to customise it. Everything’s made to order.</p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bean/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lattes, burgers, chai…" className="field rounded-full py-4 pl-12 pr-12" aria-label="Search menu" />
          {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full hover:bg-cream" aria-label="Clear search"><X className="h-4 w-4" /></button>}
        </div>
      </div>

      {/* sticky category bar */}
      <div className="sticky top-[72px] z-30 -mx-4 mt-8 bg-cream/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {categories.map((c) => {
            const has = groups.some((g) => g.id === c.id)
            return (
              <button key={c.id} onClick={() => jump(c.id)} disabled={!has}
                className={`relative flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 font-semibold transition disabled:opacity-30 ${active === c.id ? 'text-white' : 'bg-white text-bean ring-1 ring-bean/10 hover:ring-bean/30'}`}>
                {active === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-bean" transition={{ type: 'spring', damping: 30, stiffness: 400 }} />}
                <SmartImage src={c.img.replace('w=400', 'w=80')} alt="" className="relative h-8 w-8 rounded-full object-cover" />
                <span className="relative">{c.name}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setTag(tag === f.id ? null : f.id)}
              className={`chip py-1.5 text-[13px] normal-case tracking-normal transition ${tag === f.id ? 'bg-chili text-white' : 'bg-cream-200 text-bean/70 hover:bg-cream-300'}`}>
              <f.Icon className="h-3.5 w-3.5" />{f.label}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 && (
        <div className="py-24 text-center">
          <h3 className="font-display text-3xl font-bold">Nothing matches “{q}”</h3>
          <p className="mt-2 text-bean/60">Try “latte”, “chicken” or “pancakes”.</p>
          <button className="btn-dark mt-6" onClick={() => { setQ(''); setTag(null) }}>Clear search</button>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {groups.map((g) => (
          <motion.section layout key={g.id} id={`cat-${g.id}`} className="scroll-mt-48 pt-12">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-3xl font-black sm:text-4xl">{g.name}</h2>
              <span className="h-px flex-1 bg-bean/10" />
              <span className="hidden text-sm text-bean/50 sm:block">{g.blurb}</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {g.items.map((m, i) => <MenuCard key={m.id} item={m} onOpen={openItem} i={i} />)}
              </AnimatePresence>
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  )
}
