import React, { useState, useEffect } from "react";

const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  );
};

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const Test = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [value, setValue] = useState(10);

  const handleLeftClick = (id) => () => {
    setAll(allClicks.concat(id));
    setLeft(left + 1);
  };

  const handleRightClick = () => {
    setAll(allClicks.concat("R"));
    setRight(right + 1);
  };

  const setToValue = (newValue) => () => {
    setValue(newValue);
  };

  const setToValue2 = (newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {left}
      <button onClick={handleLeftClick("L")}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(" ")}</p>
      {value}
      <button onClick={() => setValue(1000)}>thousand</button>
      <button
        onClick={() => {
          console.log("clicked the button");
          setValue(0);
        }}
      >
        zero
      </button>
      <button onClick={setToValue(value + 1)}>increment</button>
      <button onClick={() => setToValue2(0)}>reset</button>

      <Button handleClick={() => setToValue2(6)} text="six" />
    </div>
  );
};

export default Test;
