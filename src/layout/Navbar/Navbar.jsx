import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";


// import listItem
import ListItem from "./elements/ListItem";
import IconButton from "./elements/IconButton";

export default function Navbar() {
  
    const { darkMode } = useTheme();

  const [listItemInfo , setListItemInfo] = useState([
    {id : 1 , title : 'Home' , hrefLink : '/'},
    {id : 2 , title : 'Pricing' , hrefLink : '/Pricing'},
    {id : 3 , title : 'Movies' , hrefLink : '/Movies'},
    {id : 4 , title : 'Series' , hrefLink : '/Series'},
    {id : 5 , title : 'Collection' , hrefLink : '/Collection'},
    {id : 6 , title : 'FAQ' , hrefLink : '/FAQ'},
  ])

  const { pathname } = useLocation()

  return (
    <div className='flex items-center justify-between static mt-4 rounded-2xl w-full h-20 px-12.5 container bg-white/20 dark:bg-[#1A1919]/30 *:text-[#091E51] dark:*:text-white'>
      {/* logo */}
        <Link to='/'>
          <img src='/src/assets/images/Logo-Dark.svg' className='w-24 h-24' alt='logo' />
        </Link>
      {/* menu */}
        <ul className="flex items-center gap-7 h-full">
          {listItemInfo.map((item) => 
            <ListItem key={item.id} {...item} isActive={pathname === item.hrefLink}/>
          )}
        </ul>
      {/* icon button */}
      <div>
          <ul className="flex items-center justify-center gap-8.5">
            <IconButton />
          </ul>
      </div>
    </div>
  )
}
