import { HeroDatas } from "../../../../data/HeroDatas";
import { useHero } from "@/context/HeroContext";


export default function HeroSlider() {

    const counter = useHero().counter
    const prevImage = (counter - 1 + HeroDatas.length) % HeroDatas.length;
    const mainImage = counter;
    const nextImage = (counter + 1) % HeroDatas.length;
    const nextByImage = (counter + 2) % HeroDatas.length;

  return (
    <div className="w-full h-full grid grid-rows-2 py-5 px-0 mx-0 lg:mt-0 md:-mt-20 -mt-24">
      <div className="h-full row-start-2 flex items-end md:justify-start justify-center">
        <div className="w-4/5 h-44 flex items-center justify-center">
            <div className="md:w-36 md:h-36 sm:w-34 sm:h-34 w-19 h-19 border border-white rounded-l-xl overflow-hidden">
                <img src={HeroDatas[prevImage].cover} alt="movieCover" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-44 md:h-44 sm:w-40 sm:h-40 w-23 h-23 border border-white rounded-xl overflow-hidden">
                <img src={HeroDatas[mainImage].cover} alt="movieCover" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-36 md:h-36 sm:w-34 sm:h-34 w-19 h-19 border border-white overflow-hidden">
                <img src={HeroDatas[nextImage].cover} alt="movieCover" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-36 md:h-36 sm:w-34 sm:h-34 w-19 h-19 border border-white rounded-r-xl overflow-hidden">
                <img src={HeroDatas[nextByImage].cover} alt="movieCover" className="w-full h-full object-cover" />
            </div>
        </div>
      </div>
    </div>
  )
}
