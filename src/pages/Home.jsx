import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Bike, Store, MapPin } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import MenuCard from '../components/MenuCard'
import { Medallion } from '../components/Logo'
import { categories, menu, combos, byId, heroImages, locations, img } from '../data/menu'
import { useCart, useUI } from '../store'
import { ksh, defaultSelection, unitPrice } from '../lib/format'

const fullPrice = (c) => c.items.reduce((s, id) => s + unitPrice(byId[id], defaultSelection(byId[id])), 0)
const promoSkins = ['bg-honey text-bean', 'bg-chili text-white', 'bg-bean text-white']
const HERO_BURGER = img('1568901346375-23c9450c58cd', 1200)

export default function Home() {
  const nav = useNavigate()
  const openItem = useUI((s) => s.openItem)
  const toast = useUI((s) => s.showToast)
  const add = useCart((s) => s.add)
  const setMode = useCart((s) => s.setMode)
  const popular = menu.filter((m) => m.tags?.includes('popular')).slice(0, 8)
  const hero = combos.find((c) => c.id === 'combo-burger') || combos[0]
  const heroPrice = fullPrice(hero) - hero.save

  const addCombo = (c) => {
    c.items.forEach((id, i) => add(id, defaultSelection(byId[id]), 1, { comboId: c.id, comboName: c.name, discount: i === 0 ? c.save : 0 }))
    toast(`${c.name} added to your bag`)
  }
  const start = (mode) => { setMode(mode); nav('/menu') }

  return (
    <>
      {/* ------------------------------ HERO: a poster ------------------------------ */}
      <section className="overflow-hidden bg-chili text-white">
        <div className="container-x relative pb-10 pt-14 lg:pb-14 lg:pt-20">
          <div className="flex items-center justify-between gap-4 text-[13px] font-extrabold uppercase tracking-[0.2em]">
            <span className="bg-bean px-3 py-1.5">Limited time only</span>
            <span className="hidden sm:inline">Nº 02 — {hero.name}</span>
          </div>

          <div className="relative mt-6">
            <h1 className="font-display text-[28vw] leading-[0.8] tracking-[-0.02em] lg:text-[17rem]">
              Smash<br /><span className="text-bean">Season.</span>
            </h1>

            {/* the burger, on a black "plate", sitting on the type */}
            <div className="relative mt-6 ml-auto w-[70vw] max-w-[440px] lg:absolute lg:right-[2%] lg:top-1/2 lg:mt-0 lg:w-[46vw] lg:-translate-y-1/2">
              <div className="aspect-square overflow-hidden rounded-full border-[10px] border-bean bg-bean">
                <SmartImage src={HERO_BURGER} alt="Classic smash burger" className="h-full w-full object-cover" fetchPriority="high" />
              </div>
              {/* price sticker */}
              <div className="absolute -left-[8%] -top-[4%] grid aspect-square w-[38%] -rotate-12 place-items-center rounded-full bg-honey text-center text-bean">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest sm:text-xs">Meal deal</div>
                  <div className="font-display text-[8vw] leading-none lg:text-5xl">{ksh(heroPrice).replace('KSh ', '')}</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest sm:text-xs">KSh</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t-2 border-white/30 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-xl text-lg font-medium leading-snug sm:text-xl">
              Two smashed patties, melted cheddar, hand-cut fries and a thick chocolate shake. Save {ksh(hero.save)} when you grab them together.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => addCombo(hero)} className="flex items-center gap-3 bg-bean px-7 py-4 text-lg font-extrabold uppercase tracking-wider text-white hover:bg-bean-800">
                Order now <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/menu" className="border-2 border-white px-7 py-4 text-lg font-extrabold uppercase tracking-wider hover:bg-white hover:text-chili">See the menu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- HOW DO YOU WANT IT ------------------------- */}
      <section className="bg-bean text-white">
        <div className="container-x grid divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { k: '01', t: 'Delivery', s: '25–35 min · free over KSh 2,500', Icon: Bike, go: () => start('delivery') },
            { k: '02', t: 'Pickup', s: 'Ready in about 15 min', Icon: Store, go: () => start('pickup') },
            { k: '03', t: 'Find a café', s: `${locations.length} cafés · Nairobi & Mombasa`, Icon: MapPin, go: () => nav('/locations') },
          ].map((o) => (
            <button key={o.k} onClick={o.go} className="group flex items-center justify-between gap-4 py-7 text-left hover:text-honey md:px-8 md:first:pl-0 md:last:pr-0">
              <span>
                <span className="block text-xs font-extrabold tracking-[0.2em] text-white/50">{o.k}</span>
                <span className="mt-1 block font-display text-5xl">{o.t}</span>
                <span className="mt-1 block text-sm text-white/60">{o.s}</span>
              </span>
              <o.Icon className="h-9 w-9 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------- THE MENU as a numbered list --------------------- */}
      <section className="container-x pt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-7xl sm:text-9xl">The menu</h2>
          <Link to="/menu" className="mb-3 hidden items-center gap-2 font-extrabold uppercase tracking-wider hover:text-chili sm:flex">Everything <ArrowRight className="h-5 w-5" /></Link>
        </div>
        <ol className="mt-6 border-t-[3px] border-bean">
          {categories.map((c, i) => {
            const n = menu.filter((m) => m.cat === c.id).length
            return (
              <li key={c.id}>
                <Link to={`/menu?cat=${c.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b-2 border-bean py-3 hover:bg-honey sm:grid-cols-[4rem_1fr_auto_auto] sm:gap-6 sm:px-2">
                  <span className="text-sm font-extrabold tracking-widest text-bean/50">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-display text-4xl leading-none sm:text-6xl">{c.name}</span>
                    <span className="mt-1 block text-sm text-bean/60">{c.blurb}</span>
                  </span>
                  <span className="hidden text-sm font-extrabold uppercase tracking-wider text-bean/60 sm:block">{n} items</span>
                  <SmartImage src={c.img.replace('w=400', 'w=200')} alt="" className="h-16 w-16 object-cover sm:h-20 sm:w-28" />
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      {/* --------------------------------- DEALS --------------------------------- */}
      <section className="container-x pt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-6xl sm:text-8xl">Deals</h2>
          <Link to="/deals" className="mb-2 flex items-center gap-2 font-extrabold uppercase tracking-wider hover:text-chili">All deals <ArrowRight className="h-5 w-5" /></Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
          {combos.map((c, i) => (
            <article key={c.id} className={`grid min-w-[85%] snap-start grid-cols-[1fr_auto] overflow-hidden rounded-2xl sm:min-w-0 ${promoSkins[i % 3]}`}>
              <div className="flex flex-col p-5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider opacity-70">Save {ksh(c.save)}</span>
                <h3 className="mt-1 font-display text-3xl">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm opacity-75">{c.note}</p>
                <div className="mt-auto flex items-center gap-3 pt-4">
                  <button onClick={() => addCombo(c)} className={`btn px-4 py-2 text-sm ${i % 3 === 0 ? 'bg-bean text-white hover:bg-bean-800' : i % 3 === 1 ? 'bg-white text-bean hover:bg-cream' : 'bg-honey text-bean hover:bg-honey-600'}`}>
                    Add · {ksh(fullPrice(c) - c.save)}
                  </button>
                </div>
              </div>
              <SmartImage src={c.img.replace('w=900', 'w=500')} alt={c.name} className="h-full w-32 object-cover sm:w-36" />
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------ BESTSELLERS ------------------------------ */}
      <section className="container-x pt-20">
        <div className="flex items-end justify-between gap-4 border-b-[3px] border-bean pb-4">
          <h2 className="font-display text-6xl sm:text-8xl">Bestsellers</h2>
          <span className="mb-2 hidden text-sm font-extrabold uppercase tracking-wider text-bean/60 sm:block">What Nairobi orders most</span>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {popular.map((m, i) => <MenuCard key={m.id} item={m} onOpen={openItem} i={i} />)}
        </div>
      </section>

      {/* ------------------------------ COFFEE STORY ----------------------------- */}
      <section className="mt-24 grid bg-honey text-bean lg:grid-cols-2">
        <div className="px-4 py-16 sm:px-10 lg:px-16 lg:py-24">
          <span className="bg-bean px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.2em] text-white">Coffee first</span>
          <div className="mt-8 font-display text-[28vw] leading-[0.8] lg:text-[13rem]">1,800<span className="text-chili">m</span></div>
          <p className="mt-8 max-w-md text-xl font-semibold leading-snug">
            Above sea level, on the red volcanic soil of Kiambu. That’s where our beans grow, and why our cappuccino tastes like blackcurrant and caramel, not ash.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t-[3px] border-bean">
            {[['14', 'Farmer co-ops'], ['Daily', 'Roasted in Westlands'], ['36h', 'Sourdough proof']].map(([n, l]) => (
              <div key={l} className="pt-4">
                <dt className="font-display text-4xl">{n}</dt>
                <dd className="mt-1 text-xs font-extrabold uppercase tracking-wider">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <SmartImage src={heroImages.beans} alt="Freshly roasted Kiambu coffee beans" className="h-full min-h-[360px] w-full object-cover" />
      </section>

      {/* -------------------------------- REWARDS -------------------------------- */}
      {/* -mb-24 cancels the footer's top margin so the two dark bands meet */}
      <section className="-mb-24 bg-bean text-white">
        <div className="container-x grid items-center gap-10 py-20 md:grid-cols-[auto_1fr]">
          <Medallion className="mx-auto h-48 w-48 sm:h-64 sm:w-64" title="Crumbs rewards" />
          <div>
            <span className="text-[13px] font-extrabold uppercase tracking-[0.2em] text-honey">Crumbs rewards</span>
            <h2 className="mt-3 font-display text-6xl sm:text-8xl">Eat. Earn.<br /><span className="text-chili">Eat free.</span></h2>
            <p className="mt-5 max-w-lg text-lg text-white/70">1 Crumb for every KSh 10. 500 Crumbs is a free coffee. 50 Crumbs the day you join, and a treat on your birthday.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="bg-chili px-7 py-4 font-extrabold uppercase tracking-wider hover:bg-chili-600">Create an account</Link>
              <Link to="/login" className="flex items-center gap-2 border-2 border-white px-7 py-4 font-extrabold uppercase tracking-wider hover:bg-white hover:text-bean">Sign in <ArrowUpRight className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
