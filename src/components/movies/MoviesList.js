import Movie from "./Movie";
import classes from "./MoviesList.module.css";

function MoviesList(props) {
  function removeMovieHandler(movieId) {
    props.onRemoveMovie(movieId);
  }

  function rateMovieHandler(movieId, value) {
    props.onRateMovie(movieId, value);
  }

  return (
    <div className={classes.container}>
      {props.moviesData.map((movie) => {
        let movieRating = null;
        if (props.ratingsData) {
          movieRating = props.ratingsData.results.find(
            (rating) => rating.id === movie.id
          );
        }

        return (
          <Movie
            key={movie.id}
            movie={movie}
            onRate={rateMovieHandler}
            onDelete={removeMovieHandler}
            withDeleteOption={props.withDeleteOption}
            userRating={
              movie.rating || (movieRating && movieRating.rating) || null
            }
          />
        );
      })}
    </div>
  );
}

export default MoviesList;
