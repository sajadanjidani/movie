import { useHero } from "@/context/HeroContext";

export default function HeroBackground() {

  const bgImage = useHero().image

  return (
    <div className="relative -z-50">
      <img src={bgImage} alt="background" className='absolute w-full h-dvh object-cover'/>
      <div className='absolute w-full h-dvh bg-linear-90 from-5% from-[#E7F6FC] dark:from-[#030A1B] to-50% to-[#030A1B]/20'></div>
      <div className='absolute w-full h-dvh bg-linear-0 from-0% from-[#E7F6FC] dark:from-[#030A1B] to-50% to-[#030A1B]/20'></div>
    </div>
  )
}
