import { Link } from "react-router-dom";
import { CategorySliderProvider } from "../../context/CategorySliderContext";

// components
import CardSlider from "../CardSlider/CardSlider";
import CategorySlider from "../CategorySlider/CategorySlider";

// icons
import { FaArrowRight } from "react-icons/fa";

export default function AdvancedSection({
  label,
  moreAddress,
  datas
}) {

  return (
    <CategorySliderProvider>

      <div className="w-full h-auto mt-24 px-14">

        <div className="flex items-center justify-between">

          <h2 className="font-bold text-4xl">
            {label}
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


        {label !== "Trends" && (
          <CategorySlider />
        )}


        <CardSlider
          category={label}
          items={datas}
        />

      </div>

    </CategorySliderProvider>
  )
}