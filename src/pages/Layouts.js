import { Outlet } from "react-router-dom";
import MainNavigation from "../components/UI/MainNavigation";
import Footer from "../components/Footer";
import { useContext } from "react";
import ProfileNavigation from "../components/UI/ProfileNavigation";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";

export const UiContext = createContext({
  mainNavSticky: true,
  setMainNavSticky: (value) => {},
});

function MainLayout() {

  const [isSticky, setIsSticky] = useState(true);

  return (
    <UiContext.Provider
      value={{
        mainNavSticky: isSticky,
        setMainNavSticky: (value) => {
          setIsSticky(value);
        },
      }}
    >
      <MainNavigation />
      <div id="main">
        <Outlet />
      </div>
      <Footer />
    </UiContext.Provider>
  );
}

export function StandardLayout() {
  const { setMainNavSticky } = useContext(UiContext);

  useEffect(() => {
    setMainNavSticky(true);
  });

  return (
    <div id="page-content">
      <Outlet />
    </div>
  );
}

export function ProfileLayout() {
  const { setMainNavSticky } = useContext(UiContext);

  useEffect(() => {
    setMainNavSticky(false);
  });

  return (
    <>
      <ProfileNavigation />
      <div id="page-content">
        <Outlet />
      </div>
    </>
  );
}



export default MainLayout;
