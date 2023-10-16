import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/UI/MainNavigation";
import Footer from "../components/Footer";
import { useContext, useEffect } from "react";
import AuthContext from "../store.js";

function Error() {

  const error = useRouteError();
    
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    if(error.status === 401) {      
      logout();
    }
  });

  let message = "Something went wrong.";
  
  if(error.status === 401) {
    message = "Something is wrong with your authentication, please login again.";
  } else if(error.status === 404) {
    message = "The resource could not be found.";
  }

  return (
    <>
      <MainNavigation />
      <div id="main">
        <div className="flex-center">{message}</div>
      </div>
      <Footer />
    </>
  );
}

export default Error;
