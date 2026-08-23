import { Link, useLocation } from "react-router-dom";
import { useState , useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";


// import listItem
import ListItem from "./elements/ListItem";
import IconButton from "./elements/IconButton";

// icons
import { RiMenuSearchLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";


export default function Navbar() {
  
  const { darkMode } = useTheme();
  const { pathname } = useLocation()


  const [isOpenMenu , setIsOpenMenu] = useState(false)
  const [listItemInfo , setListItemInfo] = useState([
    {id : 1 , title : 'Home' , hrefLink : '/'},
    {id : 2 , title : 'Pricing' , hrefLink : '/Pricing'},
    {id : 3 , title : 'Movies' , hrefLink : '/Movies'},
    {id : 4 , title : 'Series' , hrefLink : '/Series'},
    {id : 5 , title : 'Collection' , hrefLink : '/Collection'},
    {id : 6 , title : 'FAQ' , hrefLink : '/FAQ'},
  ])
  
  useEffect(() => {
    setIsOpenMenu(false);
  }, [pathname]);

  const menuStatusHandler = () => {
    setIsOpenMenu(prevStatus => !prevStatus)
  }

  return (
    <div className='flex items-center justify-between static mt-4 rounded-2xl sm:h-20 h-16 lg:px-12.5 lg:container mx-auto bg-white/20 dark:bg-[#1A1919]/30 *:text-[#091E51] dark:*:text-white w-[98%] md:px-0 sm:pr-4 pr-4'>
      {/* logo */}
      {darkMode ? (
        <Link to='/'>
          <img src='/src/assets/images/Logo-Light.svg' className='w-24 h-24' alt='logo' />
        </Link>
      ) : (
        <Link to='/'>
          <img src='/src/assets/images/Logo-Dark.svg' className='w-24 h-24' alt='logo' />
        </Link>
      )}
      {/* menu */}
        <ul className="hidden sm:flex items-center lg:gap-7 sm:gap-4 h-full">
          {listItemInfo.map((item) => 
            <ListItem key={item.id} {...item} isActive={pathname === item.hrefLink}/>
          )}
        </ul>
      {/* icon button */}
      <div className="hidden sm:block">
          <ul className="flex items-center justify-center lg:gap-8.5 md:gap-4 sm:gap-3">
            <IconButton />
          </ul>
      </div>
      {/* mobile hamberger menu */}
      <div>
        {isOpenMenu ? (
          <AiOutlineClose onClick={() => menuStatusHandler()} className="sm:hidden size-6 hover:cursor-pointer text-[#091E51] dark:text-white"/>
        ) : (
          <RiMenuSearchLine onClick={() => menuStatusHandler()} className="sm:hidden size-6 hover:cursor-pointer text-[#091E51] dark:text-white"/>
        )}
      </div>
      {isOpenMenu ? (
        <>
          <div className="absolute top-0 left-0 w-2/3 h-dvh px-4 bg-[#d5dddf] dark:bg-[#1A1919]">
            <ul className="grid gap-3 mt-2">
              {listItemInfo.map((item) => 
                <ListItem key={item.id} {...item} isActive={pathname === item.hrefLink}/>
              )}
              <ul className="flex justify-evenly gap-5 mt-2">
                <IconButton />
              </ul>
            </ul>
          </div>
          <div onClick={() => menuStatusHandler()} className="absolute top-0 right-0 w-1/3 h-dvh bg-[#b4babb]/50 dark:bg-[#252424]/50"></div>
        </>
      ) : ''}
    </div>
  )
}
