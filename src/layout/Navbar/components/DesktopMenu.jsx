import {useLocation} from "react-router-dom";
import ListItem from "../elements/ListItem";
import {navbarLinks} from "../data/navbarLinks";
import NavbarActions from "./NavbarActions";

export default function DesktopMenu(){

    const {pathname}= useLocation();

    return(
        <div className="hidden sm:flex w-full md:ml-24 sm:ml-12 justify-between">        
            <ul className="flex items-center h-full lg:gap-7 sm:gap-4 ">
                {
                navbarLinks.map(item=>(
                <ListItem
                    key={item.id}
                    {...item}
                    isActive={pathname===item.hrefLink}
                />
                ))
                }

            </ul>

            <NavbarActions />
        </div>
    )

}