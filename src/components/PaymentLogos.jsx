import { siVisa, siPaypal, siApplepay, siGooglepay, siAirtel } from 'simple-icons'
import SmartImage from './SmartImage'

const Icon = ({ si, color, className = 'h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} role="img" aria-label={si.title} fill={color || `#${si.hex}`}>
    <path d={si.path} />
  </svg>
)

// Official M-PESA wordmark. Put your own copy at /public/images/payments/mpesa.png to self-host it.
const MPESA_SRCS = ['/images/payments/mpesa.png', 'https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg']

export function MpesaLogo({ className = 'h-6' }) {
  return (
    <SmartImage
      srcs={MPESA_SRCS}
      alt="M-PESA"
      className={`${className} w-auto object-contain`}
      fallback={<span className="font-black tracking-tight text-[#4CAF50]">M-PESA</span>}
    />
  )
}

export function MastercardLogo({ className = 'h-6' }) {
  return (
    <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Mastercard">
      <circle cx="17" cy="15" r="13" fill="#EB001B" />
      <circle cx="31" cy="15" r="13" fill="#F79E1B" />
      <path d="M24 4.1a13 13 0 0 1 0 21.8 13 13 0 0 1 0-21.8z" fill="#FF5F00" />
    </svg>
  )
}

export const VisaLogo = ({ className = 'h-5' }) => <Icon si={siVisa} color="#1A1F71" className={className} />
export const PaypalLogo = ({ className = 'h-5' }) => <Icon si={siPaypal} color="#003087" className={className} />
export const ApplePayLogo = ({ className = 'h-6' }) => <Icon si={siApplepay} color="#000" className={className} />
export const GooglePayLogo = ({ className = 'h-6' }) => <Icon si={siGooglepay} color="#5F6368" className={className} />
export const AirtelLogo = ({ className = 'h-6' }) => <Icon si={siAirtel} color="#E40000" className={className} />

export default function PaymentStrip({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {[<MpesaLogo key="m" className="h-5" />, <VisaLogo key="v" />, <MastercardLogo key="mc" className="h-5" />,
        <AirtelLogo key="a" className="h-5" />, <PaypalLogo key="p" className="h-4" />, <ApplePayLogo key="ap" className="h-5" />,
        <GooglePayLogo key="g" className="h-5" />].map((el, i) => (
        <span key={i} className="grid h-9 min-w-[3.25rem] place-items-center rounded-lg bg-white px-2 ring-1 ring-bean/10">{el}</span>
      ))}
    </div>
  )
}
