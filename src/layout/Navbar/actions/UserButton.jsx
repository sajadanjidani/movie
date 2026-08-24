import { FaUser } from "react-icons/fa6";
import UserDropdown from "./UserDropdown";


export default function UserButton(){


    const user = {
        name:"Sajad Anjidani",
        phone:"09936893100"
    };


    const isLoggedIn = true;


    return (

        <li className="relative group">
        
        <FaUser
            className="hover:cursor-pointer md:size-6 sm:size-5 size-6"
        />
        
            {
                isLoggedIn &&
                <UserDropdown user={user}/>
            }

        </li>

    )

}