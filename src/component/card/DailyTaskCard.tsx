import { motion } from "framer-motion";
import React, { useEffect } from "react";
type Props = {
  circleX: number;
  circleY: number;
  coodinates1: { x: number; y: number };
  coodinates2: { x: number; y: number };
  onClick: () => void;
  isDragging: boolean;
};
const DailyTaskCard = React.forwardRef(
  (
    { circleX, circleY, coodinates1, coodinates2, isDragging, onClick }: Props,
    ref: React.Ref<SVGAElement>
  ) => {
    useEffect(() => {
      console.log(isDragging);
    }, [isDragging]);
    console.log(coodinates1);
    console.log(coodinates2);
    return (
      <>
        {isDragging ? (
          <g ref={ref} clipPath="url(#clip)">
            <path
              d={`M ${coodinates1.x},${coodinates1.y} L ${coodinates2.x},${coodinates1.y} L ${coodinates2.x},${coodinates2.y} L ${coodinates1.x},${coodinates2.y} Z`}
              fill="rgba(0, 0, 0, 0.5)"
            />
            <defs>
              <clipPath id="clip">
                <circle
                  cx={circleX}
                  cy={circleY}
                  r={circleX}
                  style={{ margin: "auto" }}
                />
              </clipPath>
            </defs>
          </g>
        ) : (
          <g onClick={onClick} ref={ref} clipPath="url(#clip)">
            <path
              d={`M ${circleX},${circleY} L ${coodinates1.x},${coodinates1.y} A ${circleX},${circleY} 0 1,1 ${coodinates2.x},${coodinates2.y} L ${circleX},${circleY} Z`}
              fill="rgba(0, 0, 0, 0.5)"
            />
            <defs>
              <clipPath id="clip">
                <circle
                  cx={circleX}
                  cy={circleY}
                  r={circleX}
                  style={{ margin: "auto" }}
                />
              </clipPath>
            </defs>
          </g>
        )}
      </>
    );
  }
);

export default motion(DailyTaskCard);
