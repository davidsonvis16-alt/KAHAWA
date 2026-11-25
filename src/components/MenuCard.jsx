import { Plus, Flame, Leaf, Sparkles, Star } from 'lucide-react'
import SmartImage from './SmartImage'
import { ksh } from '../lib/format'

export const tagStyle = {
  popular: { label: 'Bestseller', cls: 'bg-honey text-bean', Icon: Star },
  new: { label: 'New', cls: 'bg-bean text-honey', Icon: Sparkles },
  spicy: { label: 'Spicy', cls: 'bg-chili text-white', Icon: Flame },
  veg: { label: 'Veg', cls: 'bg-leaf text-white', Icon: Leaf },
}

const Tags = ({ tags, small }) => (tags || []).map((t) => {
  const s = tagStyle[t]
  return s && <span key={t} className={`chip ${small ? 'px-1.5 py-0.5 text-[10px]' : ''} ${s.cls}`}><s.Icon className="h-3 w-3" />{s.label}</span>
})

const AddButton = ({ item, onOpen, className = '' }) => (
  <button onClick={() => onOpen(item)}
    className={`grid h-10 w-10 place-items-center rounded-full bg-white text-bean ring-2 ring-bean hover:bg-honey ${className}`}
    aria-label={`Add ${item.name}`}>
    <Plus className="h-5 w-5" strokeWidth={2.75} />
  </button>
)

export default function MenuCard({ item, onOpen, i = 0, row = false }) {
  if (row) return <MenuRow item={item} onOpen={onOpen} i={i} />
  return (
    <article className="group relative flex flex-col"
    >
      <div className="relative">
        <button onClick={() => onOpen(item)} className="block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream-200" aria-label={`View ${item.name}`}>
          <SmartImage src={item.img} alt={item.name} className="h-full w-full object-cover" />
        </button>
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1"><Tags tags={item.tags} /></div>
        <AddButton item={item} onOpen={onOpen} className="absolute bottom-2.5 right-2.5" />
      </div>
      <button onClick={() => onOpen(item)} className="mt-3 text-left">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-bold leading-tight">{item.name}</h3>
          <span className="shrink-0 font-semibold tabular-nums">{ksh(item.price)}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-bean/55">{item.desc}</p>
      </button>
    </article>
  )
}

function MenuRow({ item, onOpen, i }) {
  return (
    <article className="group flex items-stretch gap-4 rounded-2xl bg-white p-4 ring-1 ring-bean/10 transition hover:ring-bean/30"
    >
      <button onClick={() => onOpen(item)} className="flex min-w-0 flex-1 flex-col text-left">
        <div className="flex flex-wrap gap-1"><Tags tags={item.tags} small /></div>
        <h3 className="mt-1.5 text-[17px] font-bold leading-tight">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-bean/55">{item.desc}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-semibold tabular-nums">{ksh(item.price)}</span>
          <span className="font-mono text-[11px] uppercase text-bean/40">{item.kcal} kcal</span>
        </div>
      </button>
      <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
        <button onClick={() => onOpen(item)} className="h-full w-full overflow-hidden rounded-xl bg-cream-200" aria-label={`View ${item.name}`}>
          <SmartImage src={item.img} alt={item.name} className="h-full w-full object-cover" />
        </button>
        <AddButton item={item} onOpen={onOpen} className="absolute -bottom-2 -right-2 h-9 w-9" />
      </div>
    </article>
  )
}
