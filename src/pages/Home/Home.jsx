import Hero from './components/Hero/Hero'
import AdvancedSection from '../../components/AdvancedSection/AdvancedSection'
import GoldenGlobeSection from './components/GoldenGlobeSection/GoldenGlobeSection'
import ActorsSection from '../../components/ActorsSection/ActorsSection'
import FrequentlyQuestionsSection from '../../components/FrequentlyQuestionsSection/FrequentlyQuestionsSection'
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
      <ActorsSection {...sectionDatas[3]}/>
      
      {/* FAQ */}
      <FrequentlyQuestionsSection />

      {/* Studios */}
      

    </div>
  )
}
