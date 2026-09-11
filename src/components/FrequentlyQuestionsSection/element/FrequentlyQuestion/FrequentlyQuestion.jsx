import { IoIosArrowDown } from "react-icons/io";

export default function FrequentlyQuestion({ id , questionTitle , questionAnswer , clickHandler , isOpen}) {

    const changeModeHandler = () => {
        clickHandler(id)
    }

  return (
    <li className="w-279">
        <div className="w-full max-h-18 px-8 border border-[#E93F9C] rounded-2xl">
            <button onClick={changeModeHandler} className="flex w-full h-17.75 justify-between items-center cursor-pointer">
                <span className="text-lg font-bold py-4">{questionTitle}</span>
                <IoIosArrowDown className={`size-6 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
            </button>
        </div>
        <div className={`w-29/30 mx-auto overflow-hidden border-x border-b border-[#E93F9C] rounded-b-2xl px-8 transition-all duration-300 ease-in-out ${isOpen ? "max-h-50 py-3 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
            <p>
                {questionAnswer}
            </p>
        </div>
    </li>
  )
}
