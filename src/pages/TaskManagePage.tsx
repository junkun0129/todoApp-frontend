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
export type DNDItem = {
  task_id: UniqueIdentifier;
  title: string;
  status: TaskStatus;
  user_name: string;
  img: string;
  created_at: string;
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
    title: "NEW",
    status_type: "NEW",
    items: [],
  },
  {
    id: "container-2",
    title: "PROCESS",
    status_type: "PROCCESS",
    items: [],
  },
  {
    id: "container-3",
    title: "DONE",
    status_type: "DONE",
    items: [],
  },
];
const TaskManagePage = () => {
  const [containers, setContainers] = useState<DNDType[]>(dataContainer);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [createModalOpen, setcreateModalOpen] = useState<boolean>(false);
  const { data, isSuccess } = useGetTaskListQuery();
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
      };
      const newContainers = containers.map((container, i) => {
        if (index === i) {
          container.items.push(newItem);
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

  useEffect(() => {
    console.log(containers);
  }, [containers]);
  //DND Handlers
  const findValueOfItems = (id: UniqueIdentifier | undefined, type: string) => {
    if (type === "container") {
      return containers.find((container) => container.id === id);
    }
    if (type === "items") {
      return containers.find((container, i) =>
        container.items.find((item) => item.task_id === id)
      );
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id);
  };
  const handleDragMove = (e: DragMoveEvent) => {
    // const { active, over } = e;
    // console.log(e);
  };
  const handleDragOver = (e: DragOverEvent) => {
    console.log(e, "dragover");
  };
  const handleDragEnd = (e: DragEndEvent) => {
    console.log("dragend :>> ", e);
  };
  const handleCreate = (values) => {
    const request: CreateTaskReq = {
      body: values,
    };

    createTaskMutation(request).then((res: any) => {
      if (res.error) {
      } else {
        const response = res.data as CreateTaskRes;
        message.success(response.result);
      }
    });
  };
  return (
    <div className=" w-full h-full ">
      <Button onClick={() => setcreateModalOpen(true)}>タスク作成</Button>
      {/* <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className=" w-full h-full flex justify-around items-center">
          {containers.map((container, i) => {
            return (
              <Container key={container.id} container={container}></Container>
            );
          })}
        </div>
      </DndContext> */}
      <TaskPanel dataSource={containers}></TaskPanel>
      <Modal open={createModalOpen} onCancel={() => setcreateModalOpen(false)}>
        <Form onFinish={handleCreate}>
          <Form.Item label={"title"} name={"title"}>
            <Input />
          </Form.Item>
          <Form.Item label={"body"} name={"body"}>
            <TextArea />
          </Form.Item>
          <Button htmlType="submit">create</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagePage;
