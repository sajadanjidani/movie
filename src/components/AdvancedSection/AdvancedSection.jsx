import { Link } from "react-router-dom";

// components
import CardSlider from "../CardSlider/CardSlider";
import CategorySlider from "../CategorySlider/CategorySlider";

// icons
import { FaArrowRight } from "react-icons/fa";


export default function AdvancedSection({label , moreAddress}) {
  return (
    <div className="w-full h-auto mt-24 px-14">
    
    {/* title section */}
    
      <div className="flex items-center justify-between">

        <h2 className="font-bold text-4xl">{label}</h2>

        {moreAddress ? (

          <Link to={moreAddress} className="flex items-center gap-2 font-semibold text-[#228EE5]">See More
              <FaArrowRight />
          </Link>

        ) : ''}

      </div>
    
      {/* Category Slider */}

      <CategorySlider />

      {/* slider section */}

      <CardSlider />

    </div>
  )
}
