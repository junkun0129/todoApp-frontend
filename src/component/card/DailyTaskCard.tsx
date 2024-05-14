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
              d={`M ${circleX},${circleY} L ${coodinates1.x},${coodinates1.y} A ${circleX},${circleY} 0 1,1 ${coodinates2.x},${coodinates2.y} L ${circleX},${circleY} Z`}
              fill={"red"}
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
          <motion.g
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{ scale: 1.05 }}
            onClick={onClick}
            ref={ref}
            clipPath="url(#clip)"
          >
            <path
              d={`M ${circleX},${circleY} L ${coodinates1.x},${coodinates1.y} A ${circleX},${circleY} 0 1,1 ${coodinates2.x},${coodinates2.y} L ${circleX},${circleY} Z`}
              fill={"red"}
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
          </motion.g>
        )}
      </>
    );
  }
);

export default motion(DailyTaskCard);
