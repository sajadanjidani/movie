import { useState } from "react"

// component
import BgHeader from "./elements/HeroBackground"
import HeroInfo from "./components/HeroInfo/HeroInfo"

export default function Hero() {

  const [counter , setCounter] = useState(0)

  setTimeout(() => {
    setCounter(1)
  } , 5000)

  return (
    <>
      <BgHeader counter={counter}/>

      <div className="w-full h-dvh flex">
        <HeroInfo counter={counter}/>
        {/* slider movie */}
        <div className="w-full h-full grid grid-rows-2">
          <div className="w-full h-full row-start-2 bg-pink-500"></div>
        </div>
      </div>
    </>
  )
}
