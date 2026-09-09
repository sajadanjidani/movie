import { Link } from "react-router-dom";
import { CategorySliderProvider } from "../../context/CategorySliderContext";

import ActorsSlider from './components/ActorsSlider/ActorsSlider'

// icons
import { FaArrowRight } from "react-icons/fa";

export default function ActorsSection({moreAddress}) {
  return (
    <CategorySliderProvider>

      <div className="w-full h-auto mt-24 px-14">

        <div className="flex items-center justify-between">

          <h2 className="font-bold text-4xl">
            Actors
          </h2>

          {moreAddress && (
            <Link 
              to={moreAddress}
              className="flex items-center gap-2 font-semibold text-[#228EE5]"
            >
              See More
              <FaArrowRight />
            </Link>
          )}

        </div>

          <ActorsSlider />

      </div>

    </CategorySliderProvider>
  )
}
