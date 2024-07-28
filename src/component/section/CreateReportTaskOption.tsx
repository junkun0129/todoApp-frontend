import { Card } from "antd";
import React from "react";
import { DefaultDailyTask } from "../../pages/ReportCreate";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { TaskList } from "../../type/task";
type Props = {
  defaultDailyTasks: DefaultDailyTask[];
  taskItems: TaskList[];
  onDrag: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onDragEnd: (info: PanInfo, task: TaskList, index: number) => void;
};
const CreateReportTaskOption = ({
  defaultDailyTasks,
  taskItems,
  onDrag,
  onDragEnd,
}: Props) => {
  return (
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
          {defaultDailyTasks.map((item, i) => (
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
              onDrag={onDrag}
              onDragEnd={(event, info) => onDragEnd(info, item, i)}
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
  );
};

export default CreateReportTaskOption;
