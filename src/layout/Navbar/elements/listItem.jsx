import { NavLink } from "react-router-dom"

export default function ListItem({hrefLink , title , isActive}) {
  return (
    <NavLink to={hrefLink}>
        <li>{title}</li>
        {isActive && <div className="mx-auto -mb-2 w-full h-1 bg-[#228EE5] blur-xs rounded-full"></div>}
    </NavLink>
  )
}
