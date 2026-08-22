import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <div className='flex items-center static mt-4 rounded-2xl w-full h-20 container bg-white/20'>
      {/* logo */}
      <Link to='/'>
        <img src='/src/assets/images/Logo-Dark.svg' className='w-24 h-24' alt='logo' />
      </Link>
      {/* menu */}
        <ul className="flex items-center gap-7 h-full">

        </ul>
      {/* button */}
    </div>
  )
}
