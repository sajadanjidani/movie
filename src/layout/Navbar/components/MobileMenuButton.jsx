import { RiMenuSearchLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";

export default function MobileMenuButton({isOpen , onClick}){
    return isOpen ? 
        <AiOutlineClose onClick={onClick} className="sm:hidden size-6 hover:cursor-pointer text-[#091E51] dark:text-white"/>
        :
        <RiMenuSearchLine onClick={onClick} className="sm:hidden size-6 hover:cursor-pointer text-[#091E51] dark:text-white"/>
}