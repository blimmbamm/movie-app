import MultiRangeSlider from "multi-range-slider-react";
import "./YearFilter.css";
import Separator from "../UI/Separator";

function YearFilter(props) {
  function toggleSliderHandler() {
    props.onToggleEnabled();
  }

  function updateReleaseYearsSelection(event) {
    props.onUpdateSelection({
      minYear: event.minValue,
      maxYear: event.maxValue,
    });
  }

  return (
    <>
      <div>
        <input
          type="checkbox"
          defaultChecked={props.releaseYears.enabled}
          onChange={toggleSliderHandler}
        />
        Select year range
      </div>
      {props.releaseYears.enabled && (
        <MultiRangeSlider
          label={false}
          ruler={false}
          min={1950}
          max={new Date().getFullYear()}
          minValue={props.releaseYears.min}
          maxValue={props.releaseYears.max}
          step={1}
          stepOnly={true}
          baseClassName="slider"
          onChange={updateReleaseYearsSelection}
        />
      )}
      <Separator />
    </>
  );
}

export default YearFilter;
