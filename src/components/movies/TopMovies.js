import {
  Link,
  useFetcher,
  useLoaderData,  
} from "react-router-dom";
import classes from "./TopMovies.module.css";
import Card from "../UI/Card";
import { useContext, useState } from "react";
import AuthContext from "../../store.js";
import Modal from "../UI/Modal";
import fetchTmdbData from "../../data/tmdb-http";
import Button from "../UI/Button";
import { Rating as StarRating } from "react-simple-star-rating";
import { useEffect } from "react";
import { fetchAllRatings } from "../../pages/Ratings";

function TopMovies() {
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";

  const { data, ratingsData } = useLoaderData();
  const { results, page: loadedPages, total_pages: totalPages } = data;

  const [moviesData, setMoviesData] = useState({
    loadedPages,
    totalPages,
    results,
  });

  useEffect(() => {
    if (fetcher.data) {
      setMoviesData((state) => {
        return {
          loadedPages: fetcher.data.page,
          totalPages: fetcher.data.total_pages,
          results: [...state.results, ...fetcher.data.results],
        };
      });
    }
  }, [fetcher.data]);

  const allResultsLoaded = moviesData.loadedPages === moviesData.totalPages;

  async function addMoreMoviesHandler() {
    if (!allResultsLoaded) {
      fetcher.submit(
        { page: moviesData.loadedPages + 1 },
        { method: "post", encType: "application/json" }
      );
    }
  }

  return (
    <>
      <div className={classes.container}>
        {moviesData.results.map((movie) => {
          const movieRating = ratingsData.results.find(
            (rating) => rating.id === movie.id
          );
          return (
            <TopMovie
              key={movie.id}
              movie={movie}
              movieRating={movieRating ? movieRating.rating : null}
            />
          );
        })}
      </div>
      {!allResultsLoaded && (
        <div className="flex-center">
          <Button onClick={addMoreMoviesHandler}>Load more</Button>
        </div>
      )}
      {isSubmitting && <Modal>Loading...</Modal>}
    </>
  );
}

function TopMovie({ movie, movieRating }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const authContext = useContext(AuthContext);

  const isAuthenticated =
    authContext.isAuthenticated || authContext.isAuthenticatedAsGuest;

  const [optionsButtonVisible, setOptionsButtonVisible] = useState(false);
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);

  const [rating, setRating] = useState(movieRating);

  function showOptionsButtonHandler() {
    setOptionsButtonVisible(true);    
  }
  function hideOptionsButtonHandler() {
    setOptionsButtonVisible(false);    
  }

  function toggleOptionsMenuHandler() {
    setOptionsButtonVisible(false);
    setOptionsMenuVisible((prevVisibility) => !prevVisibility);
  }

  const movieImagePath = "https://image.tmdb.org/t/p/w342/" + movie.poster_path;

  async function rateMovieHandler(value) {
    setStartedSubmitting(true);
    fetcher.submit(
      { type: "add-rating", ratingValue: value, movieId: movie.id },
      {
        method: "post",
        encType: "application/json",
        action: "/",
      }
    );

    setRating(value * 2);
  }


  const [startedSubmitting, setStartedSubmitting] = useState(false);
  
  useEffect(() => {
    if(startedSubmitting && !isSubmitting){
      toggleOptionsMenuHandler();
      setStartedSubmitting(false);
    }
  }, [startedSubmitting, isSubmitting]);


  return (
    <Card
      className={classes.item}
      onMouseEnter={showOptionsButtonHandler}
      onMouseLeave={hideOptionsButtonHandler}
      
    >      
      <Link to={"https://www.themoviedb.org/movie/" + movie.id}>
        <img src={movieImagePath} width="100%" alt="movie poster" />
        <div className={classes.title}>{movie.original_title}</div>
        <div className={classes.date}>{movie.release_date}</div>
      </Link>
      {optionsButtonVisible && (
        <button className={classes.options} onClick={toggleOptionsMenuHandler}>
          <div />
          <div />
          <div />
        </button>
      )}
      {optionsMenuVisible && !isAuthenticated && (
        <Modal onBackdropClick={toggleOptionsMenuHandler}>
          <div>You need to authenticate in order to rate movies.</div>
          <div className="flex-center">
            <Button type="link" to="/login">
              Check your options
            </Button>
          </div>
        </Modal>
      )}
      {((optionsMenuVisible && isAuthenticated)) && (
        
        <Modal onBackdropClick={toggleOptionsMenuHandler}>
          {!isSubmitting && <>Your rating:
          <StarRating
            onClick={rateMovieHandler}
            allowFraction={true}
            initialValue={rating / 2}
          />
          </>}
          {isSubmitting && <div>Loading...</div>}
        </Modal>
      
      )}
    </Card>
  );
}

export async function topMoviesLoader() {
  const {data} = await fetchTmdbData(
    "https://api.themoviedb.org/3/discover/movie",
    "GET"
  );

  
  const ratingsData = await fetchAllRatings();

  return { data, ratingsData };
}

export async function action({ request }) {
  const data = await request.json();

  const { page } = data;
  const { data: newMoviesData } = await fetchTmdbData(
    "https://api.themoviedb.org/3/discover/movie",
    "GET",
    { page: page }
  );
  return newMoviesData;
}

export default TopMovies;
