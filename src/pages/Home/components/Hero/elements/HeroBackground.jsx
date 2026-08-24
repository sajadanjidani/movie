import bgImage from '@/assets/images/Home/Hero/background.jpg'

export default function HeroBackground() {
  return (
    <div className="relative">
      <img src={bgImage} alt="background" className='absolute w-full h-dvh object-cover'/>
      <div className='absolute w-full h-dvh bg-linear-90 from-15% from-[#E7F6FC] dark:from-[#030A1B] to-50% to-[#E7F6FC]/5 dark:to-[#030A1B]/5'></div>
      <div className='absolute w-full h-dvh bg-linear-0 from-5% from-[#E7F6FC] dark:from-[#030A1B] to-50% to-[#E7F6FC]/5 dark:to-[#030A1B]/5'></div>
    </div>
  )
}
