import { HeroProvider } from "@/context/HeroContext";

// component
import BgHeader from "./elements/HeroBackground"
import HeroInfo from "./components/HeroInfo/HeroInfo"
import HeroSlider from "./components/HeroSlider/HeroSlider";

export default function Hero() {

  return (
    <HeroProvider>
      
      <BgHeader/>

      <div className="w-full h-dvh flex">
        <HeroInfo/>
        
        <HeroSlider/>
      </div>
      
    </HeroProvider>
  )
}
