import { Link, useFetcher, useLocation } from "react-router-dom";
import Card from "../UI/Card";
import classes from "./Movie.module.css";
import fetchTmdbData from "../../data/tmdb-http";
import { useState } from "react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { Rating as StarRating } from "react-simple-star-rating";
import { useContext } from "react";
import AuthContext from "../../store.js";

function Movie({ movie, userRating, onRate, onDelete, withDeleteOption }) {
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";

  const location = useLocation();
    
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const authContext = useContext(AuthContext);
  const isAuthenticated =
    authContext.isAuthenticated || authContext.isAuthenticatedAsGuest;

  const movieImagePath = "https://image.tmdb.org/t/p/w342/" + movie.poster_path;

  async function saveRatingHandler(value) {
    onRate(movie.id, value);
  }

  async function deleteRatingHandler() {
    onDelete(movie.id);
  }
  
  return (
    <>
      <Card className={classes.item}>
        <Link to={"https://www.themoviedb.org/movie/" + movie.id}>
          <img src={movieImagePath} alt="movie" />
        </Link>
        <div className={classes.details}>
          <div className={classes.headline}>
            <Link
              to={"https://www.themoviedb.org/movie/" + movie.id}
              className={classes.title}
            >
              {movie.title}
            </Link>
            <div className={classes.date}>{movie.release_date}</div>
          </div>
          <div className={classes.description}>{movie.overview}</div>

          <div className={classes.actions}>
            {isAuthenticated && (
              <StarRating
                onClick={saveRatingHandler}
                allowFraction={true}
                initialValue={userRating / 2}
              />
            )}
            {!isAuthenticated && (
              <Button
                type="link"
                to={"/authenticate?redirect_to=" + location.pathname}
              >
                Login to add your rating!
              </Button>
            )}
            <div className={classes["average-score"]}>
              Average user score: {(movie.vote_average * 10).toFixed(0) + "%"}
            </div>
            {withDeleteOption && (
              <Button onClick={deleteRatingHandler}>Delete rating</Button>
            )}
          </div>
        </div>
      </Card>
      {isSubmitting && <Modal>Loading...</Modal>}
      {loginModalVisible && (
        <Modal
          onBackdropClick={() => {
            setLoginModalVisible(false);
          }}
        >
          You have to authenticate to rate a movie.
        </Modal>
      )}
    </>
  );
}

export default Movie;


export async function action({request}){
  const data = await request.json();

  switch (data.type) {
    case "add-rating":      
      return addRating(data.movieId, data.ratingValue);      

    case "remove-rating":      
      return removeRating(data.movieId);
  
    default:
      throw new Error("Action type not found")
  }
} 

async function addRating(movieId, ratingValue){
  await fetchTmdbData(
    `https://api.themoviedb.org/3/movie/${movieId}/rating`,
    "POST",
    {
      session_id: sessionStorage.getItem("session_id"),
      guest_session_id: sessionStorage.getItem("guest_session_id"),
    },
    { value: ratingValue * 2 }
  );
  return null;
}

async function removeRating(movieId) {
  await fetchTmdbData(
    `https://api.themoviedb.org/3/movie/${movieId}/rating`,
    "DELETE",
    {
      session_id: sessionStorage.getItem("session_id"),
      guest_session_id: sessionStorage.getItem("guest_session_id"),
    }
  );
  return null;
}