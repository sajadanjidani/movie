import CardSlider from "../CardSlider/CardSlider";

// icons
import { FaArrowRight } from "react-icons/fa";


export default function AdvancedSection() {
  return (
    <div className="w-full h-96 mt-24 px-14">
    
    {/* title section */}
    
      <div className="flex items-center justify-between">

        <h2 className="font-bold text-4xl">Trends</h2>

        <a href="#" className="flex items-center gap-2 font-semibold text-[#228EE5]">See More
            <FaArrowRight />
        </a>

      </div>

    {/* slider section */}

    <CardSlider />

    </div>
  )
}
