import { PanInfo, motion } from "framer-motion";
import {
  ISettings,
  ISettingsPointer,
  RoundSlider,
} from "mz-react-round-slider";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import DailyTaskCard from "../component/card/DailyTaskCard";
import { TaskList } from "../type/task";
import { Button, Form, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCreateReportMutation } from "../api/reportApi";
import { getReportTimestamp } from "../util/util";
import { CreateReportReq } from "../type/report";
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
  const [maxHour, setmaxHour] = useState(8);
  const [pointers, setpointers] = React.useState<ISettingsPointer[]>([]);
  const [draggingIndex, setdraggingIndex] = useState<number | null>(null);
  const circleWidth = 320;
  const circleHeight = 320;
  const circleRef = useRef<SVGCircleElement>();
  const [isDetailModalOpen, setisDetailModalOpen] = useState<boolean>(false);
  const [modalDetail, setmodalDetail] = useState<TaskList | null>(null);
  const [indexOfOpenModal, setindexOfOpenModal] = useState<null | number>(null);
  const [dragOverlayIndex, setdragOverlayIndex] = useState<{
    index: number;
    coordinate1: { x: number; y: number };
    coordinate2: { x: number; y: number };
  } | null>(null);
  const [createReportMutation] = useCreateReportMutation();
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
    const original1 = pointers[circleIndex];
    const original2 = pointers[circleIndex + 1];
    //元々あった場所にドロップされた場合
    if (original1.value <= dropLocation && dropLocation <= original2.value) {
    } else {
      let newPointers = pointers.filter(
        (pointer, i) => i !== circleIndex && i !== circleIndex + 1
      );

      const coordinate1 = calculatePointCoordinates(dropLocation);
      const coordinate2 = calculatePointCoordinates(dropLocation + 1);
      newPointers = [
        ...newPointers,
        { ...original1, value: dropLocation, borderColor: coordinate1 },
        { ...original2, value: dropLocation + 1, borderColor: coordinate2 },
      ];

      setpointers(newPointers);
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

  const handleTaskDragEnd = (
    info: PanInfo,
    taskIndex: number,
    taskList: TaskList
  ) => {
    const { point } = info;

    const dropLocation = findDropLocation(point.x, point.y);
    if (!dropLocation) return;
    const overlaps = pointers.filter(
      (pointer) => pointer.value === dropLocation
    );
    if (!overlaps.length) {
      const coordinate1 = calculatePointCoordinates(dropLocation);
      const coordinate2 = calculatePointCoordinates(dropLocation + 1);
      console.log(coordinate1, "coordinate1");
      console.log(coordinate2, "coordinate2");

      let addPointers: ISettingsPointer[] = [
        {
          value: dropLocation,
          borderColor: coordinate1,
          bgColor: taskList,
          bgColorDisabled: { result: "", improve: "" },
          bgColorHover: { starttime: dropLocation, endtime: dropLocation + 1 },
          ariaLabel: "lskdlj",
        },
        {
          value: dropLocation + 1,
          borderColor: coordinate2,
          bgColor: taskList,
          bgColorDisabled: { result: "", improve: "" },
          bgColorHover: { starttime: dropLocation, endtime: dropLocation + 1 },
          ariaLabel: "lskdlj",
        },
      ];
      const newPointers = [...pointers, ...addPointers];
      setpointers(newPointers);
      setdragOverlayIndex(null);
    } else {
    }
  };

  useEffect(() => {
    console.log(pointers);
  }, [pointers]);

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

  const handleWorkHour = (value: number) => {
    setmaxHour(value);
  };

  const handleCreateReport = async () => {
    const timestamp = getReportTimestamp();
    console.log(timestamp);
    const request: CreateReportReq = { body: { date: timestamp } };
    const response = await createReportMutation(request);
    console.log(response);
  };

  const onDailyTaskCardClick = (taskList: TaskList, i: number) => {
    console.log(taskList);
    setisDetailModalOpen(true);
    setmodalDetail(taskList);
    setindexOfOpenModal(i);
  };
  const onDetailModalCancel = () => {
    setisDetailModalOpen(false);
    setmodalDetail(null);
    setindexOfOpenModal(null);
  };

  //util functions
  function calculatePointCoordinates(value: number) {
    const radius = circleWidth / 2;
    const originX = 0;
    const originY = 0;
    const centerX = 160;
    const centerY = 160;
    const adjustedValue2 = (value + maxHour / 4) % maxHour; // 時計の位置を調整
    const angle = (360 / maxHour) * adjustedValue2 - 180;
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
    return calcIsInsideCircle(circleX, circleY, x, y, radius, maxHour);
  }

  function updateRoundSlider(newPointers: ISettingsPointer[]) {
    const newPointersWithCoordinates = newPointers.map((pointer, i) => {
      const { value } = pointer;
      const coordinate = calculatePointCoordinates(value);
      return { ...pointer, borderColor: coordinate };
    });
    setpointers(newPointersWithCoordinates);
  }

  return (
    <div
      style={{ border: "1px solid black" }}
      className=" relative  w-full h-full flex items-center justify-center flex-col"
    >
      <Button onClick={handleCreateReport}>test</Button>
      <div className="flex">
        <div>就業時間</div>
        <Select
          options={[
            { value: 4, label: "4時間" },
            { value: 8, label: "8時間" },
          ]}
          value={maxHour}
          onChange={handleWorkHour}
        />
      </div>
      <svg
        onMouseEnter={() => console.log("object")}
        width={circleWidth}
        height={circleHeight}
        className="w-full h-[60%] relative"
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
                onDragEnd={(event, info) => handleTaskDragEnd(info, i, item)}
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
              max={maxHour}
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
        {pointers.length >= 2 &&
          pointers.map(
            (pointer, i) =>
              i % 2 === 0 && (
                <DailyTaskCard
                  onClick={() => onDailyTaskCardClick(pointer.bgColor, i)}
                  key={"dailytaskcard-" + i}
                  drag
                  dragSnapToOrigin
                  onDrag={(event, info) => handleDrag(info)}
                  onDragStart={() => handleDragStart(i)}
                  onDragEnd={(event, info) => handleDragEnd(event, info, i)}
                  circleX={circleWidth / 2}
                  circleY={circleHeight / 2}
                  coodinates1={pointers[i].borderColor}
                  coodinates2={pointers[i + 1].borderColor}
                  isDragging={
                    draggingIndex !== null ? draggingIndex === i : false
                  }
                />
              )
          )}
      </svg>

      <h1>+</h1>
      <Modal open={isDetailModalOpen} onCancel={onDetailModalCancel}>
        {modalDetail && (
          <div>
            <div>{modalDetail.title}</div>
            <div>{modalDetail.status}</div>
            <TextArea />
            <TextArea />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Jikken;
