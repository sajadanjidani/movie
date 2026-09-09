import Hero from './components/Hero/Hero'
import AdvancedSection from '../../components/AdvancedSection/AdvancedSection'
import GoldenGlobeSection from './components/GoldenGlobeSection/GoldenGlobeSection'
// datas
import { sectionDatas } from '../../data/sectionDatas'

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
      <Hero />
      
      {/* Trends */}
      <AdvancedSection {...sectionDatas[0]}/>
      
      {/* Movies */}
      <AdvancedSection {...sectionDatas[1]}/>

      <GoldenGlobeSection />

      {/* Series */}
      <AdvancedSection {...sectionDatas[2]}/>
      
      {/* Actors */}
      <AdvancedSection {...sectionDatas[3]}/>
      
    </div>
  )
}
