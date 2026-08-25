import { HeroDatas } from "../../pages/Home/data/HeroDatas"
import CardButton from "./CardButton"

export default function Card() {
    
  return (
    <div className='min-w-50 h-72 rounded-2xl bg-cover bg-center bg-no-repeat relative'
            style={{backgroundImage: `url(${HeroDatas[0].cover})`,}}
    >
        <CardButton />
    </div>
  )
}
