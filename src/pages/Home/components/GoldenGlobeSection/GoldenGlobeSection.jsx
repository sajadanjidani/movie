import GoldenGlobeText from '@/assets/images/Home/GoldenGlobe/GoldenGlobeText.svg'
import GoldenGlobeCover from '@/assets/images/Home/GoldenGlobe/GoldenGlobeCover.svg'

export default function GoldenGlobeSection() {
  return (
    <div className='w-full h-130 relative mt-24'>    
        <div className="absolute w-full h-full bg-[#DAA521] blur-sm top-0"></div>
        <div className='absolute flex gap-10 top-20 left-20 z-10'>
            <img src={GoldenGlobeText} alt='Golden Globe' className='w-140' />
            <img src={GoldenGlobeCover} alt='Golden Globe' className='w-160' />
        </div>
        <div className='absolute z-50 flex justify-center items-end w-full h-full py-10'>
            <a href='https://www.goldenglobes.com/' target='_blank' rel='noopener noreferrer' className='w-220 h-20 bg-black/40 rounded-full border border-white flex justify-center items-center font-bold text-2xl text-white'>
                Watching Golden Globe 2026 Movies
            </a>
        </div>
    </div>
  )
}
