import { PanInfo, motion } from "framer-motion";
import {
  ISettings,
  ISettingsPointer,
  RoundSlider,
} from "mz-react-round-slider";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import DailyTaskCard from "../component/card/DailyTaskCard";
import { TaskList } from "../type/task";
type SliderSlice = {
  pointer: ISettingsPointer;
  coordinate: { x: number; y: number };
  item: TaskList;
};
function calcIsInsideCircle(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number,
  radius: number,
  slices: number
) {
  // 与えられた座標が円の中心となるように平行移動します
  const translatedPointX = pointX - centerX;
  const translatedPointY = pointY - centerY;

  // 与えられた座標の距離を計算します
  const distanceSquared = translatedPointX ** 2 + translatedPointY ** 2;

  // 与えられた座標が円の外にある場合は false を返します
  if (distanceSquared > radius ** 2) {
    return null;
  }

  // 与えられた座標の角度を計算します
  let angle =
    Math.atan2(translatedPointY, translatedPointX) * (180 / Math.PI) + 90;
  if (angle < 0) {
    angle += 360; // 角度を正規化します
  }

  // 与えられた座標が円をX等分したときの何スライス目にあるかを計算します
  const sliceSize = 360 / slices;
  const sliceIndex = Math.floor(angle / sliceSize);

  return sliceIndex;
}

const Jikken = () => {
  const [taskItems, settaskItems] = useState<TaskList[]>([
    {
      task_id: "1",
      title: "タスク1",
      created_at: "2024-05-06",
      user_name: "ユーザー1",
      img: "画像1.jpg",
      status: "NEW", // 仮にTaskStatusがenumで定義されていると仮定します
      task_order: 1,
    },
    {
      task_id: "2",
      title: "タスク2",
      created_at: "2024-05-07",
      user_name: "ユーザー2",
      img: "画像2.jpg",
      status: "NEW",
      task_order: 2,
    },
    {
      task_id: "3",
      title: "タスク3",
      created_at: "2024-05-08",
      user_name: "ユーザー3",
      img: "画像3.jpg",
      status: "NEW",
      task_order: 3,
    },
  ]);
  const MAX_HOUR = 12;
  const [pointers, setpointers] = React.useState<ISettingsPointer[]>([]);
  const [draggingIndex, setdraggingIndex] = useState<number | null>(null);
  const [itemsOnCircle, setitemsOnCircle] = useState<TaskList[]>([]);
  const [coodinates, setcoodinates] = useState<{ x: number; y: number }[]>([]);
  const circleWidth = 320;
  const circleHeight = 320;
  const circleRef = useRef<SVGCircleElement>();
  const [dragOverlayIndex, setdragOverlayIndex] = useState<{
    index: number;
    coordinate1: { x: number; y: number };
    coordinate2: { x: number; y: number };
  } | null>(null);

  const handleOnChange = (newPointers: ISettingsPointer[]) => {
    console.log(newPointers);
    updateRoundSlider(newPointers);
  };

  const handleDragStart = (i: number) => {
    console.log(i);
    setdraggingIndex(i);
    // setpointers(newPointers);
  };
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    circleIndex: number
  ) => {
    const { point } = info;

    const dropLocation = findDropLocation(point.x, point.y);
    const value1 = pointers[circleIndex].value;
    const value2 = pointers[circleIndex + 1].value;
    if (value1 <= dropLocation && dropLocation <= value2) {
    } else {
      let newPointers = pointers.filter(
        (pointer, i) => i !== circleIndex && i !== circleIndex + 1
      );
      newPointers = [
        ...newPointers,
        { value: dropLocation, bgColor: { x: 0, y: 0 } },
        { value: dropLocation + 1, bgColor: { x: 0, y: 0 } },
      ];
      updateRoundSlider(newPointers);
    }
    setdragOverlayIndex(null);
    setdraggingIndex(null);
  };

  const handleDrag = (info: PanInfo) => {
    const { point } = info;

    const dropLocation = findDropLocation(point.x, point.y);
    if (dropLocation) {
      const coordinate1 = calculatePointCoordinates(dropLocation);
      const coordinate2 = calculatePointCoordinates(dropLocation + 1);
      setdragOverlayIndex({ index: dropLocation, coordinate1, coordinate2 });
    } else {
      setdragOverlayIndex(null);
    }
  };

  const handleTaskDragEnd = (info: PanInfo, taskIndex: number) => {
    const { point } = info;

    const dropLocation = findDropLocation(point.x, point.y);
    if (!dropLocation) return;
    const overlaps = pointers.filter(
      (pointer) => pointer.value === dropLocation
    );
    if (!overlaps.length) {
      let newPointers: ISettingsPointer[] = [
        ...pointers,
        { value: dropLocation, bgColor: { x: 0, y: 0 } },
        { value: dropLocation + 1, bgColor: { x: 0, y: 0 } },
      ];
      updateRoundSlider(newPointers);
      const newTaskItems = taskItems.filter((item, i) => i !== taskIndex);
      settaskItems(newTaskItems);
      setdragOverlayIndex(null);
    } else {
    }
  };

  const handleTaskDrag = (info: PanInfo) => {
    const { point } = info;

    const dropLocation = findDropLocation(point.x, point.y);
    if (dropLocation) {
      const coordinate1 = calculatePointCoordinates(dropLocation);
      const coordinate2 = calculatePointCoordinates(dropLocation + 1);
      setdragOverlayIndex({ index: dropLocation, coordinate1, coordinate2 });
    } else {
      setdragOverlayIndex(null);
    }
  };

  //util functions
  function calculatePointCoordinates(value: number) {
    const radius = circleWidth / 2;
    const originX = 0;
    const originY = 0;
    const centerX = 160;
    const centerY = 160;
    const adjustedValue2 = (value + MAX_HOUR / 4) % MAX_HOUR; // 時計の位置を調整
    const angle = (360 / MAX_HOUR) * adjustedValue2 - 180;
    let x = originX + centerX + radius * Math.cos((angle * Math.PI) / 180);
    let y = originY + centerY + radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  }

  function findDropLocation(x: number, y: number) {
    if (!circleRef.current) return;
    const circleRect = circleRef.current.getBoundingClientRect();
    const circleX = circleRect.left + circleRect.width / 2;
    const circleY = circleRect.top + circleRect.height / 2;
    const radius = circleRect.width / 2;
    return calcIsInsideCircle(circleX, circleY, x, y, radius, MAX_HOUR);
  }

  function updateRoundSlider(newPointers: ISettingsPointer[]) {
    let coodinateContainer = [];
    newPointers.map((pointer, i) => {
      const { value } = pointer;
      const coordinate = calculatePointCoordinates(value);
      coodinateContainer.push(coordinate);
    });
    setcoodinates(coodinateContainer);
    setpointers(newPointers);
  }

  return (
    <div
      style={{ border: "1px solid black" }}
      className=" relative  w-full h-full flex items-center justify-center"
    >
      {/* svg area */}

      {/* <div style={{ width: "100px", height: "100px" }}></div> */}
      <svg
        onMouseEnter={() => console.log("object")}
        width={circleWidth}
        height={circleHeight}
        className="w-full h-full relative"
      >
        {/* circle for masure */}
        <motion.circle
          ref={circleRef}
          cx={circleWidth / 2}
          cy={circleHeight / 2}
          r={circleWidth / 2}
          fill={"transparent"}
        />
        {/* task tab */}
        <foreignObject width={"100%"} height={"100%"}>
          <div className="w-[50%] h-full absolute right-0 bg-blue-300 flex flex-col items-center">
            {taskItems.map((item, i) => (
              <motion.div
                drag
                dragSnapToOrigin
                onDrag={(event, info) => handleTaskDrag(info)}
                onDragEnd={(event, info) => handleTaskDragEnd(info, i)}
                className=" w-[80%] h-[10%] bg-blue-400 mt-5 flex justify-center items-center"
                key={"taskitem-" + i}
              >
                <div>{item.title}</div>
              </motion.div>
            ))}
          </div>
        </foreignObject>

        {/* Round Circle */}
        <foreignObject
          // style={{ backgroundColor: "red" }}
          width="50%"
          height="100%"
        >
          <div>
            <RoundSlider
              max={MAX_HOUR}
              connectionBgColor="blue"
              pathStartAngle={270}
              pathEndAngle={269.999}
              onChange={handleOnChange}
              pointers={pointers}
              pointersOverlap={false}
            ></RoundSlider>
          </div>
        </foreignObject>

        {/* overlay slice whie dragging */}
        {dragOverlayIndex && (
          <g clipPath="url(#overlay-clip)">
            <path
              d={`M ${circleWidth / 2},${circleHeight / 2} L ${
                dragOverlayIndex.coordinate1.x
              },${dragOverlayIndex.coordinate1.y} A ${circleWidth / 2},${
                circleHeight / 2
              } 0 1,1 ${dragOverlayIndex.coordinate2.x},${
                dragOverlayIndex.coordinate2.y
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
        )}

        {/* rendering slices */}
        {coodinates.length >= 2 &&
          coodinates.map(
            (coodinate, i) =>
              i % 2 === 0 && (
                <DailyTaskCard
                  key={"dailytaskcard-" + i}
                  drag
                  dragSnapToOrigin
                  onDrag={(event, info) => handleDrag(info)}
                  onDragStart={() => handleDragStart(i)}
                  onDragEnd={(event, info) => handleDragEnd(event, info, i)}
                  circleX={circleWidth / 2}
                  circleY={circleHeight / 2}
                  coodinates1={coodinates[i]}
                  coodinates2={coodinates[i + 1]}
                  isDragging={
                    draggingIndex !== null ? draggingIndex === i : false
                  }
                />
              )
          )}
      </svg>
    </div>
  );
};

export default Jikken;
