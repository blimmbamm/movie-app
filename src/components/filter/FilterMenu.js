import { useState } from "react";
import GenreFilter from "./GenreFilter.js";
import PersonFilter from "./PersonFilter.js";
import YearFilter from "./YearFilter.js";
import Button from "../UI/Button.js";

function FilterMenu(props) {
  const [genres, setGenres] = useState([]);
  const [persons, setPersons] = useState([]);
  const [releaseYears, setReleaseYears] = useState({
    enabled: false,
    min: 1950,
    max: new Date().getFullYear(),
  });

  async function searchMoviesHandler() {
    let genreQueryString = "";
    if (genres.length > 0) {
      genreQueryString = genres
        .map((genreId) => genreId.toString())
        .reduce((idString, id) => idString.concat("|", id));
    }

    let personQueryString = "";
    if (persons.length > 0) {
      personQueryString = persons
        .map((person) => person.id.toString())
        .reduce((idString, id) => idString.concat(",", id));
    }

    let minReleaseDate = "";
    let maxReleaseDate = "";
    if (releaseYears.enabled) {
      minReleaseDate = releaseYears.min + "-01-01";
      maxReleaseDate = releaseYears.max + "-12-31";
    }

    
    props.onNewSearch({
      with_genres: genreQueryString,
      with_cast: personQueryString,
      "primary_release_date.gte": minReleaseDate,
      "primary_release_date.lte": maxReleaseDate,
    });
  }

  function updatePersonSelectionHandler(id, name) {
    // if person is in list, remove it, else add it:
    if (persons.find((person) => person.id === id)) {
      setPersons((persons) => persons.filter((person) => person.id !== id));
    } else {
      setPersons((persons) => [...persons, { id: id, name: name }]);
    }
  }

  function updateGenreSelectionHandler(id) {
    // if genre is in list, remove it, else add it:
    if (genres.find((genreId) => genreId === id)) {
      setGenres((genres) => genres.filter((genreId) => genreId !== id));
    } else {
      setGenres((genres) => [...genres, id]);
    }
  }

  function updateReleaseYearsSelectionHandler({ minYear, maxYear }) {
    setReleaseYears({ min: minYear, max: maxYear, enabled: true });
  }

  function toggleReleaseYearFilterHandler() {
    setReleaseYears((releaseYears) => {
      return { ...releaseYears, enabled: !releaseYears.enabled };
    });
  }

  return (
    <>
      <GenreFilter
        genres={genres}
        onUpdateSelection={updateGenreSelectionHandler}
      />

      <PersonFilter
        persons={persons}
        onUpdateSelection={updatePersonSelectionHandler}
      />

      <YearFilter
        releaseYears={releaseYears}
        onUpdateSelection={updateReleaseYearsSelectionHandler}
        onToggleEnabled={toggleReleaseYearFilterHandler}
      />

      <Button onClick={searchMoviesHandler}>Search!</Button>
    </>
  );
}

export default FilterMenu;
