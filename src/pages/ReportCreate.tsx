import { AnimatePresence, PanInfo, motion } from "framer-motion";
import {
  ISettings,
  ISettingsPointer,
  RoundSlider,
} from "mz-react-round-slider";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import DailyTaskCard from "../component/card/DailyTaskCard";
import { TaskList } from "../type/task";
import {
  Button,
  Card,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Segmented,
  SegmentedProps,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCreateReportMutation } from "../api/reportApi";
import { getReportTimestamp } from "../util/util";
import { CreateReportReq, DailyTask } from "../type/report";
import { useGetTaskListQuery } from "../api/taskApi";
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
type ExtraMemo = {
  title: string;
  body: string;
};
const ReportCreate = () => {
  const [taskItems, settaskItems] = useState<TaskList[]>([]);
  const [extraMemos, setextraMemos] = useState<ExtraMemo[]>([]);
  const [maxHour, setmaxHour] = useState(8);
  const [pointers, setpointers] = React.useState<ISettingsPointer[]>([]);
  const [draggingIndex, setdraggingIndex] = useState<number | null>(null);
  const circleWidth = 320;
  const circleHeight = 320;
  const circleRef = useRef<SVGCircleElement>();
  const [isDetailModalOpen, setisDetailModalOpen] = useState<boolean>(false);
  const [modalDetail, setmodalDetail] = useState<TaskList | null>(null);
  const [indexOfOpenModal, setindexOfOpenModal] = useState<null | number>(null);
  const [constantTime, setconstantTime] = useState<
    { value: string; label: string }[]
  >([
    { value: "rest", label: "休憩" },
    { value: "meeting", label: "会議" },
    { value: "early-leave", label: "早退" },
  ]);
  const [genre, setgenre] = useState<string>("計画");
  const [date, setdate] = useState<string | null>(null);
  const [reportStatus, setreportStatus] = useState<string | null>(null);
  const [dragOverlayIndex, setdragOverlayIndex] = useState<{
    index: number;
    coordinate1: { x: number; y: number };
    coordinate2: { x: number; y: number };
  } | null>(null);
  const [createReportMutation] = useCreateReportMutation();
  const { data: taskListData, isSuccess } = useGetTaskListQuery();
  useEffect(() => {
    if (!isSuccess) return;
    const newTaskList = taskListData.data.filter(
      (task, i) => task.status === "NEW" || task.status === "PROCESS"
    );
    settaskItems(newTaskList);
  }, [taskListData]);

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

      const newTaskItems = taskItems.filter((task, i) => i !== taskIndex);
      settaskItems(newTaskItems);
      setpointers(newPointers);
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

  const handleWorkHour = (value: number) => {
    setmaxHour(value);
  };

  const handleReportStatus = (value) => {
    console.log(value);
    setreportStatus(value);
  };

  const handleDateChange: DatePickerProps["onChange"] = (date, datestring) => {
    console.log(date);
    if (!Array.isArray(datestring)) {
      setdate(datestring);
    }
  };

  const handleGenreChange: SegmentedProps["onChange"] = (value) => {
    console.log(value);
    setgenre(value as string);
  };

  const handleSubmit = async () => {
    let dailyTasks: DailyTask[] = [];
    if (!reportStatus || !date) return;
    pointers.map((pointer, i) => {
      if (i % 2 === 0) {
        const dailyTask: DailyTask = {
          task_id: pointer.bgColor.task_id,
          result: pointer.bgColorDisabled.result,
          improve: pointer.bgColorDisabled.improve,
          starttime: pointer.value,
          endtime: pointers[i + 1].value,
        };
        dailyTasks.push(dailyTask);
      }
    });

    if (extraMemos.length) {
      extraMemos.map((memo, i) => {
        const dailyTask: DailyTask = {
          task_id: null,
          result: memo.title,
          improve: memo.body,
          starttime: 0,
          endtime: 0,
        };

        dailyTasks.push(dailyTask);
      });
    }

    const request: CreateReportReq = {
      body: {
        report: {
          date,
          category: genre,
          status: reportStatus,
          hours: maxHour,
        },
        dailyTasks,
      },
    };
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

  const onAddExtraMemo = () => {
    const newExtraMemo = { title: "", body: "" };
    setextraMemos((pre) => [...pre, newExtraMemo]);
  };

  const onDeleteExtraMemo = (selectedIndex: number) => {
    const newExtraMemos = extraMemos.filter((memo, i) => i !== selectedIndex);
    setextraMemos(newExtraMemos);
  };

  const handleExtraTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedIndex: number
  ) => {
    const { value } = e.target;
    const newExtraMemos = (extraMemos[selectedIndex].title = value);
  };
  const handleExtraBodyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    selectedIndex: number
  ) => {
    const { value } = e.target;
    const newExtraMemos = (extraMemos[selectedIndex].body = value);
  };

  const onResultInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newPointers = pointers;
    newPointers[indexOfOpenModal].bgColorDisabled.result = e.target.value;
    setpointers(newPointers);
  };

  const onImproveInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newPointers = pointers;
    newPointers[indexOfOpenModal].bgColorDisabled.improve = e.target.value;
    setpointers(newPointers);
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
    <div className="overflow-auto relative w-full h-full">
      <div className="flex w-full justify-between mt-5" style={{}}>
        <div className="ml-8" style={{ fontSize: "2rem", width: "200px" }}>
          日報作成
        </div>
        <div className="flex w-full justify-around">
          <div className="flex items-center">
            <div>日時:</div>
            <DatePicker onChange={handleDateChange} />
          </div>
          <div className="flex items-center">
            <Segmented
              onChange={handleGenreChange}
              options={[
                { value: "plan", label: "計画" },
                { value: "result", label: "実績" },
              ]}
            />
          </div>
          <div className="flex items-center">
            <div>就業時間:</div>
            <Select
              options={[
                { value: 4, label: "4時間" },
                { value: 8, label: "8時間" },
              ]}
              value={maxHour}
              onChange={handleWorkHour}
            />
          </div>
          <div className="flex items-center">
            <div>特別状態:</div>
            <Select
              className="w-[100px]"
              options={[
                { value: "rest", label: "公欠" },
                { value: "leave-early", label: "早退" },
                { value: "late", label: "遅刻" },
              ]}
              value={reportStatus}
              onChange={handleReportStatus}
            />
          </div>
        </div>
      </div>
      <div className=" relative ml-[100px] w-full flex items-center justify-center flex-col mt-10">
        <svg
          onMouseEnter={() => console.log("object")}
          width={circleWidth}
          height={circleHeight}
          className="w-full h-[600px] relative "
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
          <foreignObject width={"100%"} height={"60%"}>
            <div className="w-[50%] h-full absolute right-[100px]  flex flex-col items-center">
              <Card
                style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
                className="w-[90%] mr-[80px] mt-6"
              >
                {/* custom daily task section */}
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    boxShadow: "inset 0 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                  className=" w-full h-[40px] rounded flex items-center"
                >
                  <div className="w-full flex my-2 mx-3">
                    {constantTime.map((item, i) => (
                      <div className="mx-2 rounded bg-red-400 px-3 text-white">
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* daily task section */}
                <div className="w-full flex flex-wrap justify-around mt-4">
                  <AnimatePresence>
                    {taskItems.map((item, i) => (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileDrag={{ width: "100px", height: "50px" }}
                        drag
                        dragSnapToOrigin
                        onDrag={(event, info) => handleTaskDrag(info)}
                        onDragEnd={(event, info) =>
                          handleTaskDragEnd(info, i, item)
                        }
                        className=" w-[48%] h-[50px] rounded flex items-center justify-between my-1"
                        style={{
                          backgroundColor: "#F9F4E7",
                          border: "solid #A2A2A2 2px",
                        }}
                        key={"taskitem-" + i}
                      >
                        <div className="ml-3">{item.title}</div>
                        <div
                          style={{
                            backgroundColor: "#A38B5C",
                            fontSize: "0.6rem",
                          }}
                          className="rounded text-white py-1 px-2 mr-3"
                        >
                          {item.status}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </div>
          </foreignObject>

          {/* Round Circle */}
          <foreignObject
            // style={{ backgroundColor: "red" }}
            width="50%"
            height="60%"
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
                pathInnerBgColor="white"
                hideConnection
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
        {/* Extra Memo */}
        <div className=" -mt-[230px] mb-10 w-[90%] mr-[200px] flex flex-col items-center">
          {!!extraMemos.length &&
            extraMemos.map((memo, i) => {
              return (
                <div className="w-full my-10" key={"extramemo-" + i}>
                  <div className="flex w-full items-center">
                    <div className="w-[10%]">タイトル：</div>
                    <Input
                      className="w-[89%] mr-3"
                      onChange={(e) => handleExtraTitleChange(e, i)}
                      style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
                    />
                    <Button
                      style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
                      className="w-[30px] h-[30px] flex justify-center items-center"
                    >
                      ✕
                    </Button>
                  </div>
                  <TextArea
                    style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
                    className="mt-3"
                    onChange={(e) => handleExtraBodyChange(e, i)}
                  />
                </div>
              );
            })}
          <Button
            style={{ fontSize: "1.5rem" }}
            type="primary"
            className="w-full flex justify-center items-center"
            onClick={onAddExtraMemo}
          >
            +
          </Button>
          <div className="w-full mt-5 flex justify-end">
            <Button size="large" onClick={handleSubmit}>
              提出
            </Button>
          </div>
        </div>

        {/* Detail Modal */}
        <Modal
          okButtonProps={{ style: { display: "none" } }}
          cancelText={"戻る"}
          cancelButtonProps={{ type: "primary" }}
          open={isDetailModalOpen}
          onCancel={onDetailModalCancel}
        >
          {modalDetail && indexOfOpenModal && (
            <div>
              <div>■タスク名：{modalDetail.title}</div>
              <div className="mt-4">■タスク概要：{modalDetail.status}</div>
              <div className="mt-4">■結果</div>
              <TextArea
                onChange={onResultInputChange}
                defaultValue={pointers[indexOfOpenModal].bgColorDisabled.result}
              />
              <div className="mt-4">■改善</div>
              <TextArea
                onChange={onImproveInputChange}
                defaultValue={
                  pointers[indexOfOpenModal].bgColorDisabled.improve
                }
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReportCreate;
