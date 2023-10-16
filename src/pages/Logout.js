import { useContext, useEffect } from "react";
import { Link, redirect } from "react-router-dom";
import AuthContext from "../store.js";

function Logout() {
  const { logout } = useContext(AuthContext);
  
  useEffect(() => {
    logout();
  });

  return (
    <>
      <div className="flex-center">You have been logged out successfully. </div>
      <Link className="flex-center" to={"/"}>
        Go back home.
      </Link>
    </>
  );
}

export default Logout;

export function loader() {
  if (
    !sessionStorage.getItem("session_id") &&
    !sessionStorage.getItem("guest_session_id")
  ) {
    return redirect("/login");
  }

  return null;
}
