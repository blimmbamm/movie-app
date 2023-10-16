import { redirect, useLoaderData } from "react-router-dom";
import fetchTmdbData from "../data/tmdb-http";
import { useContext } from "react";
import AuthContext from "../store.js";

function Profile() {
  const userData = useLoaderData();

  const { isAuthenticated, isAuthenticatedAsGuest } = useContext(AuthContext);

  if (isAuthenticated) {
    return (
      <div className="text-center">
        <p>Hi {userData.username}!</p>
        <p>You're connected to your TMDB account!</p>
        <p> Check out and manage your rated movies.</p>
      </div>
    );
  }

  if (isAuthenticatedAsGuest) {
    return (
      <div className="text-center">
        <p>Hi!</p>
        <p>You're connected as a guest!</p>
        <p>
          For the next hour, you can rate movies and manage your list of rated
          movies.
        </p>
      </div>
    );
  }
}

export async function loader() {
  console.log("Profile Loader executed");
  const sessionId = sessionStorage.getItem("session_id");
  const guestSessionId = sessionStorage.getItem("guest_session_id");

  if (sessionId) {
    const { data } = await fetchTmdbData(
      "https://api.themoviedb.org/3/account",
      "GET",
      { session_id: sessionStorage.getItem("session_id") }
    );

    return data;
  } else if (guestSessionId) {
    return null;
  } else {
    return redirect("/login");
  }
}



export default Profile;
