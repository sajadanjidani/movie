import BgHeader from "./elements/HeroBackground"
import HeroInfo from "./components/HeroInfo/HeroInfo"

export default function Hero() {
  return (
    <>
      <BgHeader />

      <div className="w-full h-dvh flex">
        <HeroInfo />
        {/* slider movie */}
        <div className="w-full h-full grid grid-rows-2">
          <div className="w-full h-full row-start-2 bg-pink-500"></div>
        </div>
      </div>
    </>
  )
}
