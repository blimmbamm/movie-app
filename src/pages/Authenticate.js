import { useContext } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import AuthContext from "../store.js";
import fetchTmdbData from "../data/tmdb-http.js";
import Button from "../components/UI/Button.js";

function Authenticate() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { sessionId, redirectTo } = useLoaderData();

  function loginHandler() {
    login(sessionId);
    navigate(redirectTo);
  }

  return (
    <div className="flex-center">
      <Button onClick={loginHandler}>Confirm authentication</Button>
    </div>
  );
}

export async function loader({ request }) {
  const { data } = await fetchTmdbData(
    "https://api.themoviedb.org/3/authentication/token/new",
    "GET"
  );
  sessionStorage.setItem("request_token", data.request_token);

  const url = new URL(request.url);
  return redirect(
    "https://www.themoviedb.org/authenticate/" +
      data.request_token +
      "?redirect_to=http://localhost:3000/authenticate/confirm?redirect_to=" +
      url.searchParams.get("redirect_to")
  );
}

export async function confirmLoader({ request }) {
  // Check from url params if approved or denied here
  // if approved, run the code below, else show failure message

  const url = new URL(request.url);

  if (url.searchParams.get("approved")) {
    const { data } = await fetchTmdbData(
      "https://api.themoviedb.org/3/authentication/session/new",
      "POST",
      { request_token: sessionStorage.getItem("request_token") }
    );

    return {
      sessionId: data["session_id"],
      redirectTo: url.searchParams.get("redirect_to"),
    };    
    
  } else {
    throw new Error("blabla");
  }
}

export default Authenticate;
