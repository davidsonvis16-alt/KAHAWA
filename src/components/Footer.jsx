import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import { siInstagram, siFacebook, siX, siTiktok } from 'simple-icons'
import Logo from './Logo'
import PaymentStrip from './PaymentLogos'

const YEAR = new Date().getFullYear()

const cols = [
  { title: 'Order', links: [['/menu', 'Full menu'], ['/deals', 'Deals & combos'], ['/rewards', 'Crumbs rewards'], ['/account', 'Track an order']] },
  { title: 'Visit', links: [['/locations', 'Our cafés'], ['/locations', 'Opening hours']] },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t-[6px] border-chili bg-bean text-white/70">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">Kenyan coffee, all-day breakfast and proper comfort food. Brewing in Nairobi since 2019.</p>
          <div className="mt-6 flex gap-2">
            {[siInstagram, siTiktok, siFacebook, siX].map((si) => (
              <a key={si.slug} href="#" className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 transition hover:bg-honey hover:text-bean" aria-label={si.title}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d={si.path} /></svg>
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="eyebrow mb-4 text-white/40">{c.title}</h4>
            <ul className="space-y-2.5">
              {c.links.map(([to, label]) => <li key={label}><Link to={to} className="hover:text-honey">{label}</Link></li>)}
              {c.title === 'Visit' && <>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0700 100 200</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@kahawacrumb.co.ke</li>
              </>}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="eyebrow mb-4 text-white/40">We accept</h4>
          <PaymentStrip />
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-white/40">M-PESA Till 5 123 456 · Paybill 400 200</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 pb-24 font-mono text-xs uppercase tracking-wider text-white/40 sm:flex-row md:pb-6">
          <span>© {YEAR} Kahawa & Crumb Ltd.</span>
          <span>Prices in KSh, VAT inclusive</span>
        </div>
      </div>
    </footer>
  )
}
