import { Link } from "react-router-dom"

// icons
import { IoIosArrowForward } from "react-icons/io";

export default function UsefulLink({linkTitle , linkAddress}) {
  return (
    <Link to={linkAddress} className="flex items-center gap-2 font-bold">
        <span>{linkTitle}</span>
        <IoIosArrowForward className="text-gray-300"/>
    </Link>
  )
}
