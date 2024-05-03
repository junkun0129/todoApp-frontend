import React, { CSSProperties, useState } from "react";

const CircularSlider = () => {
  const [angle, setAngle] = useState(0);

  const handleChange = (e) => {
    setAngle(e.target.value);
  };

  const sliderStyle: CSSProperties = {
    position: "relative",
    width: "200px",
    height: "200px",
  };

  const inputStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    WebkitAppearance: "none",
    appearance: "none",
    transform: "rotate(-90deg)",
  };

  const thumbStyle: CSSProperties = {
    position: "absolute",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#4CAF50",
    cursor: "pointer",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const trackStyle: CSSProperties = {
    position: "absolute",
    width: "100px",
    height: "2px",
    backgroundColor: "#4CAF50",
    top: "50%",
    left: "50%",
    transformOrigin: "left center",
  };

  return (
    <div style={sliderStyle}>
      <input
        type="range"
        min={0}
        max={360}
        value={angle}
        onChange={handleChange}
        style={inputStyle}
      />
      <div
        className="slider-thumb"
        style={{ ...thumbStyle, transform: `rotate(${angle}deg)` }}
      />
      <div className="slider-track" style={trackStyle} />
    </div>
  );
};

const Jikken = () => {
  return (
    <div>
      <h1>lkj</h1>
      <CircularSlider />
    </div>
  );
};

export default Jikken;
