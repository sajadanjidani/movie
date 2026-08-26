// icons
import { FaPlus } from "react-icons/fa";

export default function CardButton() {
  return (
    <div className="absolute w-15 h-15 border-b-8 border-r-8 border-[#EBFAFF] dark:border-[#030A1B] rounded-br-lg rounded-tl-lg">
        <div className="absolute -top-1.5 -left-1  w-16 h-16 border-8 border-[#EBFAFF] dark:border-[#030A1B] rounded-2xl flex justify-center items-center">
            <button className="hover:cursor-pointer w-full h-full flex justify-center items-center">
                <FaPlus className="text-white size-6"/>
            </button>
        </div>
    </div>
  )
}
