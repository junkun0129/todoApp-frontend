import { PanInfo, motion } from "framer-motion";
import { ISettingsPointer, RoundSlider } from "mz-react-round-slider";
import React, { useEffect, useRef, useState } from "react";
import DailyTaskCard from "../component/card/DailyTaskCard";
import { TaskList } from "../type/task";
import { Button } from "antd";
import { useCreateReportMutation } from "../api/reportApi";
import { findCircleSliceIndex } from "../util/util";
import { CreateReportReq, DailyTask } from "../type/report";
import { useGetTaskListQuery } from "../api/taskApi";
import ReportExtraMemo from "../component/inputs/ReportExtraMemo";
import ReportCreateTaskDetailModal from "../component/modal/ReportCreateTaskDetailModal";
import OverLayCircleSliceSvg from "../component/svg/OverLayCircleSlice";
import CreateReportTaskOption from "../component/section/CreateReportTaskOption";
import CreateReportHeader from "../component/section/CreateReportHeader";
type SliderSlice = {
  pointer: ISettingsPointer;
  coordinate: { x: number; y: number };
  item: TaskList;
};

type ExtraMemo = {
  title: string;
  body: string;
};

export type DetailedTask = {
  task_id: string;
  title: string;
  result: string;
  improve: string;
  user_name: string;
  created_at: string;
  img: string;
  starttime: number;
  endtime: number;
  status: string;
};
export type DefaultDailyTask = { value: string; label: string };
export type ReportInfo = {
  maxhour: number;
  status: string | null;
  genre: string | null;
  date: string | null;
};
const ReportCreate = () => {
  const [taskItems, settaskItems] = useState<TaskList[]>([]);
  const [extraMemos, setextraMemos] = useState<ExtraMemo[]>([]);
  const [pointers, setpointers] = React.useState<ISettingsPointer[]>([]);
  const [draggingIndex, setdraggingIndex] = useState<number | null>(null);
  const circleWidth = 320;
  const circleHeight = 320;
  const circleRef = useRef<SVGCircleElement>();
  const [modalDetail, setmodalDetail] = useState<DetailedTask | null>(null);
  const [defaultDailyTasks, setdefaultDailyTasks] = useState<
    DefaultDailyTask[]
  >([
    { value: "rest", label: "休憩" },
    { value: "meeting", label: "会議" },
    { value: "early-leave", label: "早退" },
  ]);
  const [reportInfo, setreportInfo] = useState<ReportInfo>({
    maxhour: 8,
    genre: "計画",
    date: null,
    status: null,
  });
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
    updateRoundSlider(newPointers);
  };

  const handleDragStart = (i: number) => {
    setdraggingIndex(i);
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

  const handleSubmit = async () => {
    let dailyTasks: DailyTask[] = [];
    const { status, date, genre, maxhour } = reportInfo;
    if (!status || !date || genre) return;
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
          status: status,
          hours: maxhour,
        },
        dailyTasks,
      },
    };
    const response = await createReportMutation(request);
    console.log(response);
  };

  const onDailyTaskCardClick = (task: TaskList, i: number) => {
    const { starttime, endtime } = pointers[i].bgColorHover;
    const { improve, result } = pointers[i].bgColorDisabled;
    const { task_id, title, user_name, created_at, img, status } = task;
    const newDetailedTask: DetailedTask = {
      task_id,
      result,
      improve,
      starttime,
      endtime,
      title,
      user_name,
      created_at,
      img,
      status,
    };
    setmodalDetail(newDetailedTask);
  };
  const onAddExtraMemo = () => {
    const newExtraMemo = { title: "", body: "" };
    setextraMemos((pre) => [...pre, newExtraMemo]);
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

  const handleDetailedTaskModalSave = () => {
    if (!modalDetail) return;
    const modalDetailCopy = { ...modalDetail };
    const { result, improve, task_id } = modalDetailCopy;

    const newPointers = pointers.map((pointer, i) => {
      if (pointer.bgColor.task_id === task_id) {
        const newPointer: ISettingsPointer = {
          ...pointer,
          bgColorDisabled: { result, improve },
        };
        return newPointer;
      }
      return pointer;
    });

    setpointers(newPointers);
    setmodalDetail(null);
  };

  const handleDeleteExtramemo = (deleteIndex: number) => {
    const newExtraMemo: ExtraMemo[] = extraMemos.filter(
      (memo, i) => i !== deleteIndex
    );
    setextraMemos(newExtraMemo);
  };

  //util functions
  function calculatePointCoordinates(value: number) {
    const { maxhour } = reportInfo;
    const radius = circleWidth / 2;
    const originX = 0;
    const originY = 0;
    const centerX = 160;
    const centerY = 160;
    const adjustedValue2 = (value + maxhour / 4) % maxhour; // 時計の位置を調整
    const angle = (360 / maxhour) * adjustedValue2 - 180;
    let x = originX + centerX + radius * Math.cos((angle * Math.PI) / 180);
    let y = originY + centerY + radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  }

  function findDropLocation(x: number, y: number) {
    if (!circleRef.current) return;
    const { maxhour } = reportInfo;

    const circleRect = circleRef.current.getBoundingClientRect();
    const circleX = circleRect.left + circleRect.width / 2;
    const circleY = circleRect.top + circleRect.height / 2;
    const radius = circleRect.width / 2;
    return findCircleSliceIndex(circleX, circleY, x, y, radius, maxhour);
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
      <CreateReportHeader
        reportInfo={reportInfo}
        setRePortInfo={setreportInfo}
      />
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
              <CreateReportTaskOption
                defaultDailyTasks={defaultDailyTasks}
                taskItems={taskItems}
                onDrag={(event, info) => handleTaskDrag(info)}
                onDragEnd={(info, task, index) =>
                  handleTaskDragEnd(info, index, task)
                }
              />
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
                max={reportInfo.maxhour}
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
            <OverLayCircleSliceSvg
              circleWidth={circleWidth}
              circleHeight={circleHeight}
              coordinate1={dragOverlayIndex.coordinate1}
              coordinate2={dragOverlayIndex.coordinate2}
            />
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
                <ReportExtraMemo
                  key={i}
                  onTilteChange={(e) => handleExtraTitleChange(e, i)}
                  onBodyChange={(e) => handleExtraBodyChange(e, i)}
                  onDelete={() => handleDeleteExtramemo(i)}
                />
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
        <ReportCreateTaskDetailModal
          DetailedTask={modalDetail}
          setDetailedTask={setmodalDetail}
          onSave={handleDetailedTaskModalSave}
        />
      </div>
    </div>
  );
};

export default ReportCreate;
