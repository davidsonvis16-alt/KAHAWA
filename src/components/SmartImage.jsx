import { useState } from 'react'

/** Image with a fallback chain. Shows a soft placeholder if every source fails. */
export default function SmartImage({ src, srcs, alt, className = '', fallback, ...rest }) {
  const list = srcs || [src]
  const [i, setI] = useState(0)
  const [loaded, setLoaded] = useState(false)
  if (i >= list.length) {
    return fallback ?? <div role="img" aria-label={alt} className={`${className} bg-cream-200`} />
  }
  return (
    <img
      src={list[i]}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => { setLoaded(false); setI(i + 1) }}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      {...rest}
    />
  )
}
