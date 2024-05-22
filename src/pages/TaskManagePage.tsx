import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  defaultNewIndexGetter,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Reorder } from "framer-motion";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Items from "./Item";
import Item from "./Item";
import { Button, Form, Input, Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCreateTaskMutation, useGetTaskListQuery } from "../api/taskApi";
import { CreateTaskReq, CreateTaskRes, TaskStatus } from "../type/task";
import TaskPanel from "../component/panel/TaskPanel";
import useDnd from "../hooks/useDnd";
export type DNDItem = {
  task_id: UniqueIdentifier;
  title: string;
  status: TaskStatus;
  user_name: string;
  img: string;
  created_at: string;
  task_order: number;
};

export type DNDType = {
  id: UniqueIdentifier;
  title: string;
  status_type: string;
  items: DNDItem[];
};

const dataContainer: DNDType[] = [
  {
    id: "container-1",
    title: "新規タスク",
    status_type: "NEW",
    items: [],
  },
  {
    id: "container-2",
    title: "取組中のタスク",
    status_type: "PROCESS",
    items: [],
  },
  {
    id: "container-3",
    title: "完了済みタスク",
    status_type: "DONE",
    items: [],
  },
];
const TaskManagePage = () => {
  const [containers, setContainers] = useState<DNDType[]>(dataContainer);
  useState<UniqueIdentifier>();
  const [createModalOpen, setcreateModalOpen] = useState<boolean>(false);
  const { data, isSuccess, refetch } = useGetTaskListQuery();
  const [createTaskMutation] = useCreateTaskMutation();
  useEffect(() => {
    if (!isSuccess) return;
    setContainers([]);

    data.data.map((item, i) => {
      if (!containers.length) return;

      const index = containers.findIndex(
        (obj, i) => obj.status_type === item.status
      );
      const newItem: DNDItem = {
        task_id: item.task_id as UniqueIdentifier,
        title: item.title,
        status: item.status,
        user_name: item.user_name,
        img: item.img,
        created_at: item.created_at,
        task_order: item.task_order,
      };
      const newContainers = containers.map((container, i) => {
        if (index === i) {
          container.items.push(newItem);
        }
        return container;
      });
      if (!newContainers.length) return;
      const sortedContainer = newContainers.map((container, i) => {
        if (container.items.length) {
          container.items.sort((a, b) => a.task_order - b.task_order);
        }
        return container;
      });
      setContainers(newContainers);
      // const newContainers: DNDType[] = containers[index].items.push(newItem);
      // setContainers(newContainers);
    });
    return () => {
      setContainers([]);
    };
  }, [data]);

  return (
    <div className=" relative">
      <TaskPanel dataSource={containers}></TaskPanel>
    </div>
  );
};

export default TaskManagePage;
