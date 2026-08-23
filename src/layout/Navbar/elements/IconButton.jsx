import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

// icons
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";


export default function IconButton() {

    // search
    const [inputValue , setInputValue] = useState('')
    const [inputStatus , setInputStatus] = useState(false)

    const clearInputValue = () => {
        setInputValue('')
    }

    const chnageHandler = event => {
        setInputValue(() => event.target.value )
    }

    const statusHandler = () => {
        clearInputValue()
        setInputStatus(prevStatus => !prevStatus)
    }

    const formSubmit = event => {
        event.preventDefault()
        clearInputValue()
        setInputStatus(false)
        // is not complate now
    }

    // user login
    const [isLogin , setIsLogin] = useState(true)

    // mode
    const { darkMode, toggleTheme } = useTheme();

    const changeModeHandler = () => {
        toggleTheme(prevMode => !prevMode)
        document.documentElement.classList.toggle("dark");
    }


  return (
    <>
    {/* Search */}
        <li className="relative">
            <CiSearch className="hover:cursor-pointer md:size-6 sm:size-5 size-6" onClick={() => statusHandler()}/>
            {/* module */}
            <div className={`w-60 h-20 lg:-left-5 md:-left-20 sm:-left-40 -left-6 -bottom-26 bg-white dark:bg-[#1A1919] rounded-xl absolute overflow-hidden transition-all duration-300 ${inputStatus ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-7"}`}>
                <form className="w-full h-full relative pt-1.5" onSubmit={event => formSubmit(event)}>
                    <div className="border-2 border-[#030A1B] dark:border-[#228EE5] rounded-md px-2 py-1 items-center justify-center flex w-[96%] mx-auto">
                        <input type="text" className="outline-0" onChange={event => chnageHandler(event)} value={inputValue}/>
                        <button type="submit" className="align-middle"><CiSearch className="hover:cursor-pointer"/></button>
                    </div>
                    <a href="#" className="bg-blue-400 text-white block w-full py-1 text-center absolute bottom-0">Advance Search</a>
                </form>
            </div>
        </li>
    {/* Notification */}
        <li className="relative group">
            <FaBell className="hover:cursor-pointer md:size-6 sm:size-5 size-6"/>
            <ul className="hidden lg:grid absolute w-60 h-48 py-1 px-3 -left-20 -bottom-54 rounded-xl bg-white dark:bg-[#1A1919] *:text-[#030A1B] dark:*:text-white *:line-clamp-2 opacity-0 invisible -translate-y-7 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all delay-300">
                <li className="py-1.5 border-b-2 border-b-gray-100 dark:border-b-gray-800">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic, architecto.</li>
                <li className="py-1.5 border-b-2 border-b-gray-100 dark:border-b-gray-800">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic, architecto.</li>
                <li className="py-1.5 border-b-2 border-b-gray-100 dark:border-b-gray-800">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic, architecto.</li>
            </ul>
        </li>
    {/* User */}
        <li className="relative group">
            <FaUser className="hover:cursor-pointer md:size-6 sm:size-5 size-6"/>
            {isLogin ? (
                <div className="hidden lg:block absolute w-45 -left-18 -bottom-65 rounded-xl bg-white dark:bg-[#1A1919] text-[#030A1B] dark:text-white py-2 px-3 opacity-0 invisible -translate-y-7 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all delay-300">
                    <div className="grid border-b border-gray-200 dark:border-b-gray-800">
                        <span>Sajad Anjidani</span>
                        <span className="text-right">09936893100</span>
                    </div>
                    <ul className="border-b border-gray-200 dark:border-b-gray-800">
                        <li className="py-1">Dashboard</li>
                        <li className="py-1">Favorite</li>
                        <li className="py-1">Subscription</li>
                        <li className="py-1">Ticket</li>
                    </ul>
                    <button className="block mx-auto bg-red-300 w-9/10 h-9 rounded-2xl mt-2 text-red-800 hover:cursor-pointer">Logout</button>
                </div>
            ) : ''}

        </li>
    {/* Mode */}
        {darkMode ? (
            <li className="hover:cursor-pointer">
                <MdSunny className="md:size-6 sm:size-5 size-6" onClick={() => changeModeHandler()}/>
            </li>
        ) : (
            <li className="hover:cursor-pointer">
                <IoMoon className="md:size-6 sm:size-5 size-6" onClick={() => changeModeHandler()}/>
            </li>
        )}
    </>
  )
}
