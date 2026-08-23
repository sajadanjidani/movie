import { NavLink } from "react-router-dom";

export default function ListItem({ path, label }) {

  return (

    <li className="md:text-base sm:text-sm">
      <NavLink to={path}>
        {
          ({isActive}) => (
            <>
              {label}
              { isActive && <span className="block mx-auto -mb-2 w-full h-1 bg-[#228EE5] blur-xs rounded-full"/> }
            </>
          )
        }
      </NavLink>
    </li>

  );
}