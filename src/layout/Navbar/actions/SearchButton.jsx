import { useState } from "react";
import { CiSearch } from "react-icons/ci";


export default function SearchButton() {


    const [searchValue, setSearchValue] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);


    const clearSearch = () => {
        setSearchValue("");
    };


    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };


    const handleSearchToggle = () => {
        clearSearch();
        setIsSearchOpen(prev => !prev);
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        clearSearch();
        setIsSearchOpen(false);

        // Search API will be added later
    };


    return (

        <li className="relative">


            <CiSearch
                className="hover:cursor-pointer md:size-6 sm:size-5 size-6 "
                onClick={handleSearchToggle}
            />

            <div
                className={`w-60 h-20 lg:-left-5 md:-left-25 sm:-left-40 -left-6 -bottom-26 bg-white dark:bg-[#1A1919] rounded-xl absolute overflow-hidden transition-all duration-300
                    ${
                        isSearchOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-7"
                    }
                `}
            >

                <form
                    className="w-full h-full relative pt-1.5"
                    onSubmit={handleSubmit}
                >

                    <div
                        className="border-2 border-[#030A1B] dark:border-[#228EE5] rounded-md px-2 py-1 flex items-center justify-center w-[96%] mx-auto"
                    >

                        <input
                            type="text"
                            className="outline-0"
                            value={searchValue}
                            onChange={handleInputChange}
                        />


                        <button type="submit">

                            <CiSearch
                                className="hover:cursor-pointer"
                            />

                        </button>


                    </div>


                    <a
                        href="#"
                        className="bg-blue-400 text-white block w-full py-1 text-center absolute bottom-0"
                    >
                        Advance Search
                    </a>


                </form>

            </div>

        </li>

    );

}