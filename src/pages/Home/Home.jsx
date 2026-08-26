import Hero from './components/Hero/Hero'
import AdvancedSection from '../../components/AdvancedSection/AdvancedSection'
// datas
import { sectionDatas } from '../../data/sectionDatas'

export default function Home() {
  console.log(sectionDatas[0])
  return (
    <div className='overflow-x-hidden'>
      <Hero />
      <AdvancedSection {...sectionDatas[0]}/>
      <AdvancedSection {...sectionDatas[1]}/>
      <AdvancedSection {...sectionDatas[2]}/>
    </div>
  )
}
