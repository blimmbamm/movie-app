import classes from "./PersonFilter.module.css";
import fetchTmdbData from "../../data/tmdb-http";
import { useRef, useState } from "react";
import closeImg from "../../images/close.svg";
import { useEffect } from "react";
import Separator from "../UI/Separator";

function PersonFilter(props) {
  const [foundPersons, setFoundPersons] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  async function fetchPersonsHandler(event) {
    setSearchValue(event.target.value);

    // ToDo: debounce
    const { data } = await fetchTmdbData(
      "https://api.themoviedb.org/3/search/person",
      "GET",
      { query: event.target.value }
    );

    data.results.sort(
      (person1, person2) => person2.popularity - person1.popularity
    );
    const filteredPersons = data.results.filter(
      (person) => (person.popularity > 10) && (person.known_for_department === "Acting")
    );

    setFoundPersons(filteredPersons);
  }

  function togglePersonSelectionHandler(id, name) {
    props.onUpdateSelection(id, name);
  }

  const searchRef = useRef();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!searchRef.current.contains(event.target)) {
        setSearchValue("");
        setFoundPersons([]);
      }
    }
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  return (
    <>
      <div>Search for actors, directors, etc.:</div>
      <div className={classes.container}>
        <div className={classes.search} ref={searchRef}>
          <div className={classes.input}>
            <input
              placeholder="Search person..."
              onChange={fetchPersonsHandler}
              value={searchValue}
            />
            {searchValue && (
              <div
                className={classes.close}
                onClick={() => {
                  setSearchValue("");
                  setFoundPersons([]);
                }}
              >
                <img src={closeImg} alt="close" />
              </div>
            )}
          </div>
          {foundPersons.length > 0 && (
            <div className={classes["results-container"]}>
              <div className={classes["results"]}>
                {foundPersons.map((person) => (
                  <PersonResultItem
                    key={person.id}
                    person={person}
                    onAddPersonToFilter={togglePersonSelectionHandler}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {props.persons.length > 0 && (
          <div className={classes.selection}>
            {props.persons.map((person) => (
              <PersonFilterItem
                key={person.id}
                person={person}
                onRemovePersonFromFilter={togglePersonSelectionHandler}
              />
            ))}
          </div>
        )}
      </div>
      <Separator />
    </>
  );
}

function PersonResultItem(props) {
  function addToPersonsSelectionHandler() {
    props.onAddPersonToFilter(props.person.id, props.person.name);
  }

  return (
    <div
      className={classes["result-item"]}
      id={props.person.id}
      onClick={addToPersonsSelectionHandler}
    >
      {props.person.name}
    </div>
  );
}

function PersonFilterItem(props) {
  function removePersonFilterHandler() {
    props.onRemovePersonFromFilter(props.person.id);
  }

  return (
    <div
      className={classes["selection-item"]}
      onClick={removePersonFilterHandler}
    >
      {props.person.name}
    </div>
  );
}

export default PersonFilter;
