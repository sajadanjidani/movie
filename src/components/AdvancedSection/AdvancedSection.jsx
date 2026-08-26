import CardSlider from "../CardSlider/CardSlider";
import CategorySlider from "../CategorySlider/CategorySlider";

// icons
import { FaArrowRight } from "react-icons/fa";


export default function AdvancedSection() {
  return (
    <div className="w-full h-auto mt-24 px-14">
    
    {/* title section */}
    
      <div className="flex items-center justify-between">

        <h2 className="font-bold text-4xl">Trends</h2>

        <a href="#" className="flex items-center gap-2 font-semibold text-[#228EE5]">See More
            <FaArrowRight />
        </a>

      </div>
    
      {/* Category Slider */}

      <CategorySlider />

      {/* slider section */}

      <CardSlider />

    </div>
  )
}
