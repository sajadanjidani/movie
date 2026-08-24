import imdbLogo from '@/assets/images/Home/imdb-logo.svg'

// icons
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";


export default function MovieRating() {
  return (
    <div className="flex items-center mt-2 gap-1">
        <div className="flex gap-1.5 text-[#E5DB22] *:size-5">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalf />
        </div>
        <img src={imdbLogo} alt="imdbLogo" className='w-9 h-5' />
        <span className='font-semibold'>7.7</span>
    </div>
  )
}
