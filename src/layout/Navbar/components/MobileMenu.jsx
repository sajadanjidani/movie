import {useLocation} from "react-router-dom";
import ListItem from "../elements/ListItem";
import NavbarActions from "./NavbarActions";
import {navbarLinks} from "../data/navbarLinks";


export default function MobileMenu({onClose}){

    const { pathname } = useLocation();

    return(
        <>
            <div className="absolute top-0 left-0 w-2/3 h-dvh px-4 bg-[#d5dddf] dark:bg-[#1A1919]">
                <ul className="grid gap-3 mt-2">
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
                <ul className="flex justify-evenly gap-5 mt-4">
                    <NavbarActions />
                </ul>
            </div>
            
            <div
                onClick={onClose}
                className="absolute top-0 right-0 w-1/3 h-dvh bg-[#b4babb]/50 dark:bg-[#252424]/50"
            />
        </>
    )
}