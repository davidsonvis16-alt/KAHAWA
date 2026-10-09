import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Clock, Star, Bike, Coffee, MapPin, Gift } from 'lucide-react'
import { useRef } from 'react'
import SmartImage from '../components/SmartImage'
import MenuCard from '../components/MenuCard'
import { categories, menu, combos, byId, heroImages, locations } from '../data/menu'
import { useCart, useUI } from '../store'
import { ksh, defaultSelection, unitPrice } from '../lib/format'
import { MpesaLogo, VisaLogo, MastercardLogo } from '../components/PaymentLogos'

const ease = [0.22, 1, 0.36, 1]

function Floating({ src, alt, label, price, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{ opacity: { delay, duration: 0.5 }, scale: { delay, duration: 0.5, ease }, y: { delay: delay + 0.5, duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
      className={`absolute flex items-center gap-3 rounded-[1.4rem] bg-white p-2 pr-4 shadow-lift ${className}`}
    >
      <SmartImage src={src} alt={alt} className="h-14 w-14 rounded-2xl object-cover" />
      <div>
        <div className="text-sm font-bold leading-tight">{label}</div>
        <div className="text-sm font-extrabold text-chili">{price}</div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const openItem = useUI((s) => s.openItem)
  const popular = menu.filter((m) => m.tags?.includes('popular')).slice(0, 8)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const add = useCart((s) => s.add)
  const toast = useUI((s) => s.showToast)
  const featured = combos[1]

  const addCombo = (c) => {
    c.items.forEach((id, i) => add(id, defaultSelection(byId[id]), 1, { comboId: c.id, comboName: c.name, discount: i === 0 ? c.save : 0 }))
    toast(`${c.name} added to your bag`)
  }

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chip bg-white text-bean ring-1 ring-bean/10 normal-case tracking-normal text-sm">
              <Coffee className="h-4 w-4 text-chili" /> Kiambu AA, roasted every morning
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}
              className="mt-5 font-display text-[3.2rem] font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
              Coffee first.<br />
              <span className="relative inline-block text-chili">
                Then everything
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden>
                  <motion.path d="M2 10 C 80 2, 200 2, 298 8" stroke="#F2B33D" strokeWidth="6" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.9, ease }} />
                </svg>
              </span><br />else.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-lg text-lg leading-relaxed text-bean/70">
              Proper Kenyan coffee, fluffy all-day breakfasts, smashed burgers and crispy chicken — delivered hot across Nairobi in about 30 minutes.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-primary px-8 py-4 text-lg">Order now <ArrowRight className="h-5 w-5" /></Link>
              <Link to="/deals" className="btn-ghost px-7 py-4 text-lg">Today’s deals</Link>
            </motion.div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2"><Star className="h-5 w-5 fill-honey text-honey" /><b>4.8</b><span className="text-bean/55">· 12k+ reviews</span></div>
              <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-chili" /><b>25–35 min</b><span className="text-bean/55">delivery</span></div>
              <div className="flex items-center gap-2 text-bean/55">Pay with <MpesaLogo className="h-5" /><VisaLogo className="h-4" /><MastercardLogo className="h-5" /></div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <motion.div style={{ y: imgY }} initial={{ opacity: 0, scale: 0.92, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9, ease }}
              className="absolute inset-[6%] overflow-hidden rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-cream-200 shadow-lift">
              <SmartImage src={heroImages.main} alt="A cappuccino with latte art" className="h-full w-full object-cover" fetchpriority="high" />
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ scale: { delay: 0.8, type: 'spring' }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }}
              className="absolute -right-1 top-2 grid h-32 w-32 place-items-center rounded-full bg-honey sm:h-36 sm:w-36">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                <defs><path id="c" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
                <text fontSize="10.5" fontWeight="800" letterSpacing="2.4" fill="#2A1810"><textPath href="#c">FREE DELIVERY · OVER KSH 2,500 ·</textPath></text>
              </svg>
              <Bike className="h-9 w-9 text-bean" />
            </motion.div>
            <Floating src={heroImages.burger} alt="Classic smash burger" label="Classic Smash" price="KSh 890" className="-left-2 top-[18%] sm:-left-8" delay={0.7} />
            <Floating src={heroImages.chicken} alt="Crispy chicken" label="Crispy Bucket" price="KSh 1,890" className="-right-2 bottom-[22%] sm:-right-6" delay={0.9} />
            <Floating src={heroImages.pancakes} alt="Pancake stack" label="Pancake Stack" price="KSh 620" className="bottom-0 left-[10%]" delay={1.1} />
          </div>
        </div>
      </section>

      {/* --------------------------- CATEGORY RAIL --------------------------- */}
      <section className="container-x">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-black sm:text-4xl">What are you craving?</h2>
          <Link to="/menu" className="hidden items-center gap-1 font-bold text-chili sm:flex">Full menu <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
          {categories.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="snap-start">
              <Link to={`/menu?cat=${c.id}`} className="group flex w-28 flex-col items-center text-center sm:w-auto">
                <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-cream-200 ring-4 ring-white shadow-soft transition group-hover:ring-chili">
                  <SmartImage src={c.img} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </span>
                <span className="mt-3 font-bold leading-tight">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----------------------------- BESTSELLERS ---------------------------- */}
      <section className="container-x mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip bg-chili/10 text-chili">Nairobi’s favourites</span>
            <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">Bestsellers</h2>
          </div>
          <Link to="/menu" className="btn-ghost">See everything <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((m, i) => <MenuCard key={m.id} item={m} onOpen={openItem} i={i} />)}
        </div>
      </section>

      {/* ------------------------------ BIG DEAL ------------------------------ */}
      <section className="container-x mt-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease }}
          className="grain relative grid overflow-hidden rounded-[2.5rem] bg-chili text-white md:grid-cols-2">
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <span className="chip bg-white/20 text-white">Deal of the week</span>
            <h2 className="mt-4 font-display text-5xl font-black leading-[0.95] sm:text-6xl">{featured.name}</h2>
            <p className="mt-4 max-w-sm text-lg text-white/85">{featured.note}. Save {ksh(featured.save)} when you grab them together.</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-5xl font-black">{ksh(featured.items.reduce((s, id) => s + unitPrice(byId[id], defaultSelection(byId[id])), 0) - featured.save)}</span>
              <span className="text-xl text-white/60 line-through">{ksh(featured.items.reduce((s, id) => s + unitPrice(byId[id], defaultSelection(byId[id])), 0))}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => addCombo(featured)} className="btn bg-white px-8 py-4 text-lg text-chili shadow-[0_6px_0_#A93421] hover:bg-cream active:translate-y-1 active:shadow-none">Add to bag</button>
              <Link to="/deals" className="btn px-6 py-4 text-lg ring-2 ring-white/40 hover:bg-white/10">All deals</Link>
            </div>
          </div>
          <div className="relative min-h-[300px]">
            <SmartImage src={featured.img.replace('w=900', 'w=1200')} alt={featured.name} className="absolute inset-0 h-full w-full object-cover md:[clip-path:ellipse(85%_100%_at_100%_50%)]" />
          </div>
        </motion.div>
      </section>

      {/* ------------------------------- MARQUEE ------------------------------ */}
      <div className="mt-24 overflow-hidden border-y-2 border-bean bg-honey py-4">
        <motion.div className="flex w-max gap-10 whitespace-nowrap font-display text-3xl font-black" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {['Roasted in Nairobi', 'Kiambu AA beans', 'All-day breakfast', 'Hot in 30 minutes', 'Pay with M-PESA', 'Baked every morning'].map((t) => (
                <span key={t} className="flex items-center gap-10">{t}<span className="text-chili">✺</span></span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* -------------------------------- STORY ------------------------------- */}
      <section className="container-x mt-24 grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-[2.5rem] bg-cream-200">
            <SmartImage src={heroImages.beans} alt="Freshly roasted coffee beans" className="aspect-[4/5] w-full object-cover" />
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="absolute -bottom-6 -right-2 w-56 rounded-3xl bg-bean p-5 text-cream shadow-lift sm:-right-8">
            <div className="font-display text-5xl font-black text-honey">1,800m</div>
            <p className="mt-1 text-sm text-cream/75">above sea level, on the red volcanic soils where our beans are grown.</p>
          </motion.div>
        </div>
        <div>
          <span className="chip bg-leaf/10 text-leaf">Farm to cup</span>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">Grown in Kiambu.<br />Roasted in Nairobi.<br />Poured for you.</h2>
          <p className="mt-6 text-lg leading-relaxed text-bean/70">
            We buy directly from smallholder cooperatives in Kiambu and Nyeri, pay above Fairtrade rates, and roast in small batches every morning at our Westlands roastery. That’s why our cappuccino tastes like blackcurrant and caramel, not ash.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[['14', 'farmer co-ops'], ['36h', 'sourdough proof'], ['5', 'cafés & counting']].map(([n, l]) => (
              <div key={l} className="rounded-3xl bg-white p-5 ring-1 ring-bean/5">
                <div className="font-display text-3xl font-black text-chili">{n}</div>
                <div className="mt-1 text-sm text-bean/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- REWARDS ------------------------------ */}
      <section className="container-x mt-28">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="grain relative overflow-hidden rounded-[2.5rem] bg-bean p-8 text-cream sm:p-12">
            <Gift className="h-10 w-10 text-honey" />
            <h2 className="mt-4 font-display text-4xl font-black sm:text-5xl">Every sip earns Crumbs.</h2>
            <p className="mt-4 max-w-md text-lg text-cream/75">Get 1 Crumb for every KSh 10 you spend. 500 Crumbs = a free coffee. Plus 50 Crumbs just for signing up, and a treat on your birthday.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary">Join free</Link>
              <Link to="/rewards" className="btn px-6 ring-2 ring-cream/30 hover:bg-white/10">How it works</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-cream-200">
            <SmartImage src={heroImages.interior2} alt="Inside a Kahawa & Crumb café" className="h-full min-h-[280px] w-full object-cover" />
            <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-white/95 p-5 backdrop-blur">
              <div className="flex items-center gap-2 font-bold"><MapPin className="h-5 w-5 text-chili" /> {locations.length} cafés in Nairobi & Mombasa</div>
              <Link to="/locations" className="mt-2 inline-flex items-center gap-1 font-bold text-chili">Find your nearest <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
