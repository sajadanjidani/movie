import UsefulLink from "./element/UsefulLink/UsefulLink"
// icons
import { BiLogoTelegram } from "react-icons/bi";
import { SlSocialInstagram } from "react-icons/sl";

export default function Footer() {

    const usefulLinks = [
        {id : 1 , linkTitle : 'Home' , linkAddress : '/'},
        {id : 2 , linkTitle : 'My Portfolio' , linkAddress : 'https://github.com/sajadanjidani'},
        {id : 3 , linkTitle : 'GitHub Repository' , linkAddress : 'https://github.com/sajadanjidani/movie'},
        {id : 4 , linkTitle : 'Get This Website' , linkAddress : 'https://github.com/sajadanjidani/movie/tags'},
        {id : 5 , linkTitle : 'FAQ' , linkAddress : '/FAQ'},
    ]

  return (
    <div className="h-40 mt-40">
      {/* useful links */}
        <div className="flex justify-between mx-auto w-3/5 gap-2">
            {usefulLinks.map(link => (
                <UsefulLink key={link.id} {...link}/>
            ))}
        </div>
      {/* socalmedia */}
        <div className="flex justify-center items-center gap-10 h-10 mt-10">
            <div className="flex justify-center items-center w-12 h-12 rounded-lg bg-[#030A1B] dark:bg-[#EBFAFF]">
                <BiLogoTelegram className="size-7 text-white dark:text-black"/>
            </div>
            <div className="flex justify-center items-center w-12 h-12 rounded-lg bg-[#030A1B] dark:bg-[#EBFAFF]">
                <SlSocialInstagram className="size-7 text-white dark:text-black"/>
            </div>
        </div>
    </div>
  )
}
