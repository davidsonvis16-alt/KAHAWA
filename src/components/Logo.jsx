import { Link } from 'react-router-dom'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Kahawa & Crumb home">
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${light ? 'bg-cream text-bean' : 'bg-bean text-cream'} transition group-hover:rotate-[-6deg]`}>
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
          <path d="M16 26h26v8a13 13 0 0 1-26 0z" fill="currentColor" />
          <path d="M42 29h3a5 5 0 0 1 0 10h-4" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <path d="M25 13c-2.5 3 2.5 5 0 8.5M33 13c-2.5 3 2.5 5 0 8.5" stroke="#E0533A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`font-display text-[1.35rem] font-black leading-none tracking-tight ${light ? 'text-cream' : 'text-bean'}`}>
        Kahawa<span className="text-chili">&</span>Crumb
      </span>
    </Link>
  )
}
