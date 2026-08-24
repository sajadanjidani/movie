import BgHeader from "./elements/HeroBackground"

export default function Hero() {
  return (
    <>
      <BgHeader />

      <div className="w-full h-dvh flex">
        {/* info movie */}
        <div className="w-full h-full grid grid-rows-2">
          <div className="w-full h-full row-start-2 bg-yellow-500"></div>
        </div>
        {/* slider movie */}
        <div className="w-full h-full grid grid-rows-2">
          <div className="w-full h-full row-start-2 bg-pink-500"></div>
        </div>
      </div>
    </>
  )
}
