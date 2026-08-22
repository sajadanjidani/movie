import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoMoon } from "react-icons/io5";

export default function IconButton() {
  return (
    <>
        <li className="hover:cursor-pointer">
            <CiSearch size={24}/>
        </li>
        <li className="hover:cursor-pointer">
            <FaBell size={24}/>
        </li>
        <li className="hover:cursor-pointer">
            <FaUser size={24}/>
        </li>
        <li className="hover:cursor-pointer">
            <IoMoon size={24}/>
        </li>
    </>
  )
}
