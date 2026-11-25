import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="container-x grid place-items-center py-32 text-center">
      <div>
        <div className="font-display text-[10rem] text-chili sm:text-[14rem]">404</div>
        <h1 className="font-display text-5xl">This cup is empty.</h1>
        <p className="mt-2 text-bean/60">The page you’re after doesn’t exist.</p>
        <Link to="/menu" className="btn-primary mt-8">Back to the menu</Link>
      </div>
    </div>
  )
}
