import { useHero } from "@/context/HeroContext";

// image
import imdbLogo from '@/assets/images/Home/imdb-logo.svg'

// icons
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";



export default function MovieRating() {

  const rating = useHero().rating

  const starCount = rating / 2;

  const fullStars = Math.floor(starCount);
  const hasHalfStar = starCount % 1 >= 0.5;

  return (
    <div className="flex items-center mt-2 gap-1">
        <div className="flex gap-1.5 text-[#E5DB22] *:size-5">
          {
            [...Array(fullStars)].map((_, index) => (
              <FaStar key={index} />
            ))
          }
            
          {
            hasHalfStar && <FaStarHalfAlt />
          }

          {
            [...Array(5 - fullStars - (hasHalfStar ? 1 : 0))]
              .map((_, index) => (
                <FaStar
                  key={index}
                  className="text-gray-400"
              />
            ))
          }
        </div>
        <img src={imdbLogo} alt="imdbLogo" className='w-9 h-5' />
        <span className='font-semibold'>{rating}</span>
    </div>
  )
}
