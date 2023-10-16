import { NavLink } from "react-router-dom";
import classes from "./ProfileNavigation.module.css";



function ProfileNavigation() {
    

  return <nav className={classes.navbar}>
      <Item to={""}>Profile</Item>
      <Item to={"ratings"}>Ratings</Item>
      <Item to={"/logout"}>Logout</Item>
    </nav>;
}

function Item({ children, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? classes.active : "")}
      end
    >
      {children}
    </NavLink>
  );
}

export default ProfileNavigation;
