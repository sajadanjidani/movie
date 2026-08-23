import {Link} from "react-router-dom";
import {useTheme} from "../../../context/ThemeContext";


export default function Logo(){

 const {darkMode}=useTheme();


 const logo = darkMode
 ? "/src/assets/images/Logo-Light.svg"
 : "/src/assets/images/Logo-Dark.svg";


 return(
   <Link to="/">
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-24"
      />
   </Link>
 )

}