import { Link } from "react-router-dom";
import { useHero } from "@/context/HeroContext";

// icons
import { FaPlay } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";

export default function HeroActions() {

  const watchUrl = useHero().watchUrl;
  const detailsUrl = useHero().detailsUrl;

  
  return (
    <div className="flex gap-3 mt-3">
        <Link href={watchUrl} className="flex justify-center items-center gap-2 w-48 h-11 bg-[#228EE5] font-semibold rounded-4xl">
            <FaPlay className="size-3"/>
            Whatch Movie
        </Link>
        <Link href={detailsUrl} className="flex justify-center items-center gap-2 w-32 h-11 border-2 border-[#228EE5] font-semibold rounded-4xl">
            More Info
            <GoArrowRight className="size-4"/>
        </Link>
    </div>
  )
}
