import { LuHouse, LuSearch, LuShoppingCart, LuUser } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (page) =>{
        navigate(page)
    }
    return(
        <nav className="fixed inset-x-0 bottom-0 z-50 h-16 bg-full-white shadow-[0_-4px_14px_rgba(15,23,42,0.12)] flex flex-row justify-around items-center">
            <LuHouse className={`text-4xl shrink-0 ${location.pathname == "/" ? "stroke-deep-blue" : "stroke-gray"} active:stroke-light-blue transition duration-300 active:scale-95`} onClick={() => handleNavigation("/")}/>
            <LuSearch className={`text-4xl shrink-0 ${location.pathname == "/search" ? "stroke-deep-blue" : "stroke-gray"} active:stroke-light-blue transition duration-300 active:scale-95`} onClick={() => handleNavigation("/search")}/>
            <LuShoppingCart className={`text-4xl shrink-0 ${location.pathname == "/shoppingcart" ? "stroke-deep-blue" : "stroke-gray"} active:stroke-light-blue transition duration-300 active:scale-95`} onClick={() => handleNavigation("/shoppingcart")}/>
            <LuUser className={`text-4xl shrink-0 ${location.pathname == "/account" ? "stroke-deep-blue" : "stroke-gray"} active:stroke-light-blue transition duration-300 active:scale-95`} onClick={() => handleNavigation("/account")}/>
        </nav>
    );
}

export default NavBar