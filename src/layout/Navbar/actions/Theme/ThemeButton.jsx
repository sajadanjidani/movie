import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";

import { useTheme } from "../../../../context/ThemeContext";


export default function ThemeButton() {


    const { darkMode, toggleTheme } = useTheme();


    const handleThemeToggle = () => {
        toggleTheme();
    };


    const ThemeIcon = darkMode
        ? MdSunny
        : IoMoon;


    return (

        <li className="hover:cursor-pointer">

            <ThemeIcon
                className="md:size-6 sm:size-5 size-6"
                onClick={handleThemeToggle}
            />

        </li>

    );

}