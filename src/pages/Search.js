import { useState } from "react";
import MoviesList from "../components/movies/MoviesList";
import FilterMenu from "../components/filter/FilterMenu";
import Button from "../components/UI/Button";
import fetchTmdbData from "../data/tmdb-http";
import Modal from "../components/UI/Modal";
import { useFetcher, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { fetchAllRatings } from "./Ratings";

function Search() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const { ratingsData } = useLoaderData();

  const [moviesData, setMoviesData] = useState({
    loadedPages: 0,
    totalPages: 1,
    results: [],
  });
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    if (fetcher.data) {
      setMoviesData((state) => {
        return {
          loadedPages: fetcher.data.page,
          totalPages: fetcher.data.total_pages,
          results: fetcher.data.newSearch
            ? [...fetcher.data.results]
            : [...state.results, ...fetcher.data.results],
        };
      });
    }
  }, [fetcher.data]);

  const allResultsLoaded = moviesData.loadedPages >= moviesData.totalPages;

  async function updateQueryParamsAndFetchMoviesHandler(updatedQueryParams) {
    setQueryParams(updatedQueryParams);

    fetcher.submit(
      {
        page: 1,
        queryParams: updatedQueryParams,
        newSearch: true,
      },
      { method: "post", encType: "application/json" }
    );
  }

  async function loadMoreMoviesHandler() {
    if (!allResultsLoaded) {
      fetcher.submit(
        {
          page: moviesData.loadedPages + 1,
          queryParams: queryParams,
          newSearch: false,
        },
        {
          method: "post",
          encType: "application/json",
        }
      );
    }
  }

  function rateMovieHandler(movieId, ratingValue) {
    fetcher.submit(
      { type: "add-rating", movieId, ratingValue },
      {
        method: "post",
        encType: "application/json",
        action: "/",
      }
    );
  }

  return (
    <>
      <FilterMenu onNewSearch={updateQueryParamsAndFetchMoviesHandler} />
      {moviesData.results.length > 0 && (
        <>
          <MoviesList
            moviesData={moviesData.results}
            onRateMovie={rateMovieHandler}
            ratingsData={ratingsData}
          />
          <div className="flex-center">
            {!allResultsLoaded && (
              <Button onClick={loadMoreMoviesHandler}>Load more</Button>
            )}
          </div>
        </>
      )}
      {(moviesData.totalPages === 0) && <div className="flex-center">No results found.</div>}
      {isSubmitting && <Modal>Loading...</Modal>}
    </>
  );
}

export async function loader() {
  const { data } = await fetchTmdbData(
    "https://api.themoviedb.org/3/genre/movie/list",
    "GET"
  );

  const ratingsData = await fetchAllRatings();

  return { genres: data.genres, ratingsData };
}

export async function action({ request }) {
  const data = await request.json();
  const { page, queryParams, newSearch } = data;
  const { data: newMoviesData } = await fetchTmdbData(
    "https://api.themoviedb.org/3/discover/movie",
    "GET",
    { ...queryParams, page }
  );
  return { ...newMoviesData, newSearch };
}

export default Search;
