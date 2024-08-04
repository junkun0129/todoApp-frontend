import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { OverLayIndex } from "../../pages/ReportCreate";
type Props = {
  circleX: number;
  circleY: number;
  coodinates1: { x: number; y: number };
  coodinates2: { x: number; y: number };
  onClick: () => void;
  isDragging: boolean;
  overlayIndex: OverLayIndex;
};
const DailyTaskCard = React.forwardRef(
  (
    {
      circleX,
      circleY,
      coodinates1,
      coodinates2,
      isDragging,
      onClick,
      overlayIndex,
    }: Props,
    ref: React.Ref<SVGAElement>
  ) => {
    return (
      <>
        {isDragging && overlayIndex ? (
          <motion.g ref={ref} clipPath="url(#clip)">
            <path
              d={`M ${circleX},${circleY} L ${overlayIndex.coordinate1.x},${overlayIndex.coordinate1.y} A ${circleX},${circleY} 0 1,1 ${overlayIndex.coordinate2.x},${overlayIndex.coordinate2.y} L ${circleX},${circleY} Z`}
              fill={"#A1DF97"}
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
        ) : (
          <motion.g
            // whileHover={{
            //   scale: 1.03,
            // }}
            // whileTap={{ scale: 1.05 }}
            onClick={onClick}
            ref={ref}
            clipPath="url(#clip)"
          >
            <path
              d={`M ${circleX},${circleY} L ${coodinates1.x},${coodinates1.y} A ${circleX},${circleY} 0 1,1 ${coodinates2.x},${coodinates2.y} L ${circleX},${circleY} Z`}
              fill={"#A1DF97"}
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
