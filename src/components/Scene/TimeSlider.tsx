import { FC, useCallback, useMemo } from "react";
import Slider from "@mui/material/Slider";
import { MIN_TIME_ACCELERATION, MAX_TIME_ACCELERATION } from "../App";
import "./TimeSlider.scss";
import { isArray } from "lodash";

interface TimeSliderProps {
  setTimeAcceleration: React.Dispatch<React.SetStateAction<number>>;
  timeAcceleration: number;
  loaded: boolean;
}

const TimeSlider: FC<TimeSliderProps> = ({
  setTimeAcceleration,
  timeAcceleration,
  loaded,
}) => {
  const onChange = useCallback(
    (event: Event, value: number | number[], activeThumb: number) => {
      if (isArray(value)) return;
      loaded &&
        setTimeAcceleration(
          (value / 100) * (MAX_TIME_ACCELERATION - MIN_TIME_ACCELERATION) +
            MIN_TIME_ACCELERATION
        );
    },
    [setTimeAcceleration]
  );
  const sliderValue = useMemo(
    () =>
      ((timeAcceleration - MIN_TIME_ACCELERATION) /
        (MAX_TIME_ACCELERATION - MIN_TIME_ACCELERATION)) *
      100,
    [timeAcceleration]
  );
  return (
    <div id="slider-container">
      <h3 id="slider-title">Time Acceleration</h3>
      <Slider
        id="slider-control"
        defaultValue={100}
        onChange={onChange}
        value={sliderValue}
        disabled={!loaded}
      />
    </div>
  );
};
export default TimeSlider;
