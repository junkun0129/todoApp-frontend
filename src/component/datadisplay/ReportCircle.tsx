import React from "react";
import { DailyTask } from "../../type/report";
type Props = {
  radius: number;
  dailyTasks: DailyTask[];
  maxHours: number;
};
const ReportCircle = ({ radius, dailyTasks, maxHours }: Props) => {
  //utils
  function calculatePointCoordinates(value: number) {
    const centerX = radius;
    const centerY = radius;
    const angle = ((2 * Math.PI) / maxHours) * (value - 1);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  }
  return (
    <svg
      width="70%"
      height="70%"
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      className="flex justify-center items-center"
    >
      <circle cx={radius} cy={radius} r={radius} fill="rgba(0, 0, 0, 0.1)" />
      {dailyTasks.length &&
        dailyTasks.map((dailytask, j) => {
          const { x: startX, y: startY } = calculatePointCoordinates(
            dailytask.starttime
          );
          const { x: endX, y: endY } = calculatePointCoordinates(
            dailytask.endtime
          );

          return (
            <g key={j}>
              <path
                d={`M ${radius},${radius} L ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY} Z`}
                fill="#A1DF97"
              />
            </g>
          );
        })}
    </svg>
  );
};

export default ReportCircle;
