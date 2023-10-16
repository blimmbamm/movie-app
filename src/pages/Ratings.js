import { redirect, useFetcher, useLoaderData } from "react-router-dom";
import fetchTmdbData from "../data/tmdb-http";
import MoviesList from "../components/movies/MoviesList";
import { useState } from "react";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import { useEffect } from "react";

function Ratings() {
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";

  const data = useLoaderData();
  const { results, page: loadedPages, total_pages: totalPages } = data;

  const [ratingsData, setRatingsData] = useState({
    loadedPages,
    totalPages,
    results,
  });

  useEffect(() => {
    if (fetcher.data) {
      setRatingsData((state) => {
        return {
          loadedPages: fetcher.data.page,
          totalPages: fetcher.data.total_pages,
          results: [...state.results, ...fetcher.data.results],
        };
      });
    }
  }, [fetcher.data]);

  const allResultsLoaded = ratingsData.loadedPages === ratingsData.totalPages;

  function removeMovieHandler(movieId) {
    fetcher.submit(
      { type: "remove-rating", movieId },
      { method: "post", encType: "application/json", action: "/" }
    );

    const filteredRatings = ratingsData.results.filter(
      (movie) => movie.id !== movieId
    );
    setRatingsData((state) => {
      return { ...state, results: filteredRatings };
    });
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

  async function loadMoreRatingsHandler() {
    if (!allResultsLoaded) {
      fetcher.submit(
        {
          page: ratingsData.loadedPages + 1,
        },
        {
          method: "post",
          encType: "application/json",
        }
      );
    }
  }

  let ratingsList = (
    <div className="flex-center">
      You don't have any ratings yet, maybe start adding some?
    </div>
  );

  if (ratingsData.results.length > 0) {
    ratingsList = (
      <>
        <div className="flex-start">Your ratings:</div>
        <MoviesList
          moviesData={ratingsData.results}
          onRateMovie={rateMovieHandler}
          onRemoveMovie={removeMovieHandler}
          withDeleteOption={true}
        />
        {!allResultsLoaded && (
          <div className="flex-center">
            <Button onClick={loadMoreRatingsHandler}>Load more</Button>
          </div>
        )}
        {isSubmitting && <Modal>Loading...</Modal>}
      </>
    );
  }

  return ratingsList;
}

export async function loader() {
  console.log("Ratings loader executed");

  if (
    sessionStorage.getItem("session_id") ||
    sessionStorage.getItem("guest_session_id")
  ) {
    return await fetchRatings(1);
  }

  return redirect("/login");
}

export async function action({ request }) {
  console.log("Ratings action executed");

  const { page } = await request.json();
  return fetchRatings(page);
}

async function fetchRatings(page) {
  if (sessionStorage.getItem("session_id")) {
    const { data } = await fetchTmdbData(
      "https://api.themoviedb.org/3/account/123/rated/movies",
      "GET",
      { session_id: sessionStorage.getItem("session_id"), page, sort_by: "created_at.desc" }
    );
    return data;
  }
  if (sessionStorage.getItem("guest_session_id")) {
    const { data } = await fetchTmdbData(
      `https://api.themoviedb.org/3/guest_session/${sessionStorage.getItem(
        "guest_session_id"
      )}/rated/movies`,
      "GET",
      { page, sort_by: "created_at.desc" }
    );
    return data;
  }

  return { results: [], page: 1, total_pages: 1 };
}

export async function fetchAllRatings() {
  let ratingsData = { results: [], loadedPages: 0, totalPages: 1 };
  while (ratingsData.loadedPages < ratingsData.totalPages) {
    const ratings = await fetchRatings(ratingsData.loadedPages + 1);
    ratingsData.results = [...ratingsData.results, ...ratings.results];
    ratingsData.loadedPages = ratings.page;
    ratingsData.totalPages = ratings.total_pages;
  }

  return ratingsData;
}

export default Ratings;
