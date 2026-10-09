import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="container-x grid place-items-center py-32 text-center">
      <div>
        <div className="font-display text-[8rem] font-black leading-none text-chili">404</div>
        <h1 className="font-display text-4xl font-black">This cup is empty.</h1>
        <p className="mt-2 text-bean/60">The page you’re after doesn’t exist.</p>
        <Link to="/menu" className="btn-primary mt-8">Back to the menu</Link>
      </div>
    </div>
  )
}
