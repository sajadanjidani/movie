import Hero from './components/Hero/Hero'
import AdvancedSection from '../../components/AdvancedSection/AdvancedSection'

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
      <Hero />
      <AdvancedSection/>
      <AdvancedSection/>
      <AdvancedSection/>
    </div>
  )
}
