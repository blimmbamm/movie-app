import { useLoaderData } from "react-router-dom";
import classes from "./GenreFilter.module.css";
import { useState } from "react";
import Separator from "../UI/Separator";

function GenreFilter(props) {
 
  const { genres } = useLoaderData();

  function toggleGenreSelectionHandler(id) {
    props.onUpdateSelection(id);
  }

  return (
    <>
      <div className={classes.header}>Choose genres:</div>
      <div className={classes.container}>
        {genres.map((genre) => (
          <GenreFilterItem
            key={genre.id}
            genre={genre}
            onToggleSelection={toggleGenreSelectionHandler}
          />
        ))}
      </div>
      <Separator />      
    </>
  );
}

function GenreFilterItem(props) {
  const [selected, setSelected] = useState(false);

  const className = `${classes.item} ${selected ? classes.selected : ""}`;

  function toggleSelectGenreHandler() {
    setSelected((prevSelected) => !prevSelected);
    props.onToggleSelection(props.genre.id);
  }

  return (
    <div
      id={props.genre.id}
      className={className}
      onClick={toggleSelectGenreHandler}
    >
      {props.genre.name}
    </div>
  );
}

export default GenreFilter;
