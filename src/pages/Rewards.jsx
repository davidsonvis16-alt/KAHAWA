import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, Cake, Gift, Crown } from 'lucide-react'
import { useAuth } from '../store'

const tiers = [
  { pts: 250, Icon: Cake, title: 'Free pastry', text: 'Any croissant, doughnut or slice of cake.' },
  { pts: 500, Icon: Coffee, title: 'Free coffee', text: 'Any hot or iced coffee, any size, any milk.' },
  { pts: 1200, Icon: Gift, title: 'Free breakfast', text: 'The Big Kahawa Breakfast or a pancake stack.' },
  { pts: 3000, Icon: Crown, title: 'Gold status', text: 'Double Crumbs on every order for a year.' },
]

export default function Rewards() {
  const user = useAuth((s) => s.user)
  return (
    <div className="container-x pt-10">
      <div className="grain rounded-[2.5rem] bg-bean px-8 py-14 text-center text-cream sm:px-16">
        <span className="chip bg-honey text-bean">Crumbs rewards</span>
        <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] sm:text-7xl">Spend KSh 10, earn 1 Crumb.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-cream/70">Crumbs never expire while you order at least once every 6 months. Redeem them at checkout, online or in-store.</p>
        {user ? (
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-lg">You have <b className="font-display text-3xl text-honey">{user.points}</b> Crumbs</div>
        ) : (
          <Link to="/signup" className="btn-primary mt-8 px-8 py-4 text-lg">Join & get 50 Crumbs</Link>
        )}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t, i) => (
          <motion.div key={t.pts} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-bean/5">
            <t.Icon className="h-10 w-10 text-chili" />
            <div className="mt-5 font-display text-4xl font-black">{t.pts.toLocaleString()}</div>
            <div className="text-sm font-bold uppercase tracking-wide text-bean/40">Crumbs</div>
            <h3 className="mt-4 text-xl font-bold">{t.title}</h3>
            <p className="mt-1 text-bean/60">{t.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
