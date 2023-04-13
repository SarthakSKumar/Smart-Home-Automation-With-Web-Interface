import React from "react";
import "./button.css";
const Button = () => {
  return (
    <>
      <button
        className="button"
        onClick={() => {
          console.log("This Button was Clicked!");
        }}
      >
        Button
      </button>
    </>
  );
};

export default Button;
