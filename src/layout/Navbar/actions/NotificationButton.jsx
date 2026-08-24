import { FaBell } from "react-icons/fa";
import { notifications } from "../data/notifications";


export default function NotificationButton(){


return (

<li className="relative group">


    <FaBell
        className="
            hover:cursor-pointer
            md:size-6
            sm:size-5
            size-6
        "
    />


    <ul
        className="hidden lg:grid absolute w-60 h-48 py-1 px-3 -left-20 -bottom-54 rounded-xl bg-white dark:bg-[#1A1919] text-[#030A1B] dark:text-white opacity-0 invisible -translate-y-7 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all delay-300"
    >

        {
            notifications.map(notification => (

                <li
                    key={notification.id}
                    className="
                        py-1.5
                        border-b
                        border-gray-100
                        dark:border-gray-800
                        line-clamp-2
                    "
                >
                    {notification.message}
                </li>

            ))
        }


    </ul>


</li>

);

}