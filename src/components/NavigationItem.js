import { NavLink } from "react-router-dom";

function NavigationItem({to, children}){
    return <NavLink to={to} className={({isActive}) => isActive? "active" : ""}>{children}</NavLink>
}

export default NavigationItem;