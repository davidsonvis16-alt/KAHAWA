import { useId } from 'react'
import { Link } from 'react-router-dom'

/**
 * The Kahawa & Crumb medallion: a red disc, a black band carrying the name in lime,
 * and a stamped cup in the middle. Flat, three colours, reads at 40px and at 400px.
 */
export function Medallion({ className = 'h-14 w-14', title = 'Kahawa & Crumb' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title}>
      <defs>
        {/* top arc: baseline r=76, letters grow outward; bottom arc: baseline r=88, letters grow inward */}
        <path id={`t${id}`} d="M 24 100 A 76 76 0 0 1 176 100" />
        <path id={`b${id}`} d="M 12 100 A 88 88 0 0 0 188 100" />
      </defs>
      <circle cx="100" cy="100" r="100" fill="#0E0E0C" />
      <circle cx="100" cy="100" r="64" fill="#E2400C" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#D9F23B" strokeWidth="2" />
      <circle cx="100" cy="100" r="68" fill="none" stroke="#D9F23B" strokeWidth="2" />
      <g fill="#D9F23B" fontFamily="Anton, Impact, sans-serif" textAnchor="middle">
        <text fontSize="21" letterSpacing="2.5"><textPath href={`#t${id}`} startOffset="50%">KAHAWA &amp; CRUMB</textPath></text>
        <text fontSize="13" letterSpacing="3.5"><textPath href={`#b${id}`} startOffset="50%">NAIROBI · EST · 2019</textPath></text>
      </g>
      {/* side stars between the two lines of type */}
      <g fill="#D9F23B">
        <path d="M18 100l3-5 3 5-3 5z" />
        <path d="M176 100l3-5 3 5-3 5z" />
      </g>
      {/* the cup */}
      <g fill="#fff">
        <path d="M70 90h56v12a28 28 0 0 1-56 0z" />
        <path d="M126 94h5a11 11 0 0 1 0 22h-7v-7h7a4 4 0 0 0 0-8h-5z" />
        <rect x="64" y="134" width="72" height="6" rx="3" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round">
        <path d="M88 82c-5-5 5-9 0-16" />
        <path d="M108 82c-5-5 5-9 0-16" />
      </g>
    </svg>
  )
}

export default function Logo({ light = false, className = '', compact = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Kahawa & Crumb home">
      <Medallion className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
      {!compact && (
        <span className={`hidden font-display text-[1.7rem] leading-[0.85] sm:block ${light ? 'text-white' : 'text-bean'}`}>
          Kahawa<br /><span className="text-chili">&amp;</span> Crumb
        </span>
      )}
    </Link>
  )
}
