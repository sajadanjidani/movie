import SearchButton from "../actions/SearchButton";
import NotificationButton from "../actions/NotificationButton";
import UserButton from "../actions/UserButton";
import ThemeButton from "../actions/ThemeButton";


export default function NavbarActions(){

    return(

        <ul className="flex items-center w-full sm:w-auto justify-between sm:justify-start lg:gap-8.5 md:gap-4 sm:gap-3 sm:px-0 px-2">
        
            <SearchButton/>

            <NotificationButton/>

            <UserButton/>

            <ThemeButton/>
        
        </ul>

    )

}