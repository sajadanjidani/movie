import { useEffect, useState } from "react" 

// components
import Logo from "./components/Logo"
import DesktopMenu from "./components/DesktopMenu"
import MobileMenuButton from "./components/MobileMenuButton"
import MobileMenu from "./components/MobileMenu"
import { useLocation } from "react-router-dom"


export default function Navbar(){

  const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false)

  const { pathname } = useLocation();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false)
  } , [pathname])

 return (
   <nav className="flex items-center justify-between static w-[98%] sm:h-20 h-16 mt-4 mx-auto lg:px-12.5 md:px-0 md:pr-4 pr-4 rounded-2xl bg-white/20 dark:bg-[#1A1919]/30 *:text-[#091E51] dark:*:text-white">

      <Logo />

      <DesktopMenu />

      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {
        isMobileMenuOpen &&
        <MobileMenu onClose={toggleMobileMenu} />
      }

   </nav>
 )
}