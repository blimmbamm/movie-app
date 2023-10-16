import { useContext } from "react";
import Button from "../components/UI/Button";
import fetchTmdbData from "../data/tmdb-http";
import AuthContext from "../store.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const { loginAsGuest } = useContext(AuthContext);

  const navigate = useNavigate();

  async function startGuestSessionHandler() {
    
    const { data } = await fetchTmdbData(
      "https://api.themoviedb.org/3/authentication/guest_session/new"
    );

    loginAsGuest(data["guest_session_id"]);

    navigate("/profile");

  }

  return (
    <>
      <div className="flex-center">
        You can connect to your TMDB account to see and manage your rated movies
        from there:
      </div>
      <div className="flex-center">
        <Button type="link" to={"/authenticate?redirect_to=/profile"}>
          Go to TMDB.org!
        </Button>
      </div>
      <div className="flex-center">
        Alternatively, you can continue as guest. However, your movie ratings
        will be deleted after 60 minutes of inactivity:
      </div>
      <div className="flex-center">
        <Button onClick={startGuestSessionHandler}>Continue as guest!</Button>
      </div>
    </>
  );
}

export default Login;
