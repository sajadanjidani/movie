import StudiosItem from "./element/StudiosItem"
import { StudiosDatas } from "../../data/StudiosDatas"

import { useTheme } from '@/context/ThemeContext'

export default function StudiosSection() {

    const datas = StudiosDatas
    const { darkMode } = useTheme();


  return (
    <div>
      <h2 className="text-5xl font-bold text-center">Studios</h2>
      <div className="w-4/5 mx-auto my-15 h-100 grid justify-items-center items-center grid-cols-5 grid-rows-2 gap-4">
        {datas.map(data => (
            darkMode ? (
                <StudiosItem key={data.id} alt={data.alt} srcImage={data.dark}/>
            ) : (
                <StudiosItem key={data.id} alt={data.alt} srcImage={data.light}/>
            )
        ))}
      </div>
    </div>
  )
}
