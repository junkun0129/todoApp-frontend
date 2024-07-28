import React from "react";

type Props = {
  circleWidth: number;
  circleHeight: number;
  coordinate1: { x: number; y: number };
  coordinate2: { x: number; y: number };
};
const OverLayCircleSliceSvg = ({
  circleWidth,
  circleHeight,
  coordinate1,
  coordinate2,
}: Props) => {
  return (
    <g clipPath="url(#overlay-clip)">
      <path
        d={`M ${circleWidth / 2},${circleHeight / 2} L ${coordinate1.x},${
          coordinate1.y
        } A ${circleWidth / 2},${circleHeight / 2} 0 1,1 ${coordinate2.x},${
          coordinate2.y
        } L ${circleWidth / 2},${circleHeight / 2} Z`}
        fill="rgba(0, 0, 0, 0.5)"
      />
      <defs>
        <clipPath id="overlay-clip">
          <circle
            cx={circleWidth / 2}
            cy={circleHeight / 2}
            r={circleWidth / 2}
            style={{ margin: "auto" }}
          />
        </clipPath>
      </defs>
    </g>
  );
};

export default OverLayCircleSliceSvg;
