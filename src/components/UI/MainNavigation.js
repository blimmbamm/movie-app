// import NavigationItem from "./NavigationItem";
import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { useContext } from "react";
import { UiContext } from "../../pages/Layouts";

function MainNavigation() {
  const { mainNavSticky } = useContext(UiContext);

  const classNames = `${classes.navbar} ${mainNavSticky ? classes.sticky : ""}`;

  return (
    <nav className={classNames}>
      <Item to={""}>Home</Item>
      <Item to={"search"}>Search</Item>
      <Item to={"profile"}>Profile</Item>
    </nav>
  );
}

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? classes.active : "")}
    >
      {children}
    </NavLink>
  );
}

export default MainNavigation;
