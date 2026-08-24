import { userMenuItems } from "../data/userMenuItems";


export default function UserDropdown({user}) {


    return (

        <div
            className="hidden lg:block absolute w-45 -left-18 -bottom-65 rounded-xl bg-white dark:bg-[#1A1919] text-[#030A1B] dark:text-white py-2 px-3 opacity-0 invisible -translate-y-7 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all delay-300"
        >    

            <div className="grid border-b border-gray-200 dark:border-gray-800">
            
                <span>
                    {user.name}
                </span>

                <span className="text-right">
                    {user.phone}
                </span>

            </div>

            <ul className="border-b border-gray-200 dark:border-gray-800">

                {
                    userMenuItems.map(item => (
                    <li
                        key={item.id}
                        className="py-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1A1919] px-2 my-1 rounded-lg"
                    >
                        {item.label}
                    </li>
                    ))
                }

            </ul>

            <button className="block mx-auto bg-red-300 w-9/10 h-9 rounded-2xl mt-2 text-red-800 hover:cursor-pointer">
            Logout
            </button>

        </div>

    )

}