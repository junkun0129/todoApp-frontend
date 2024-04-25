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
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Reorder } from "framer-motion";
import React, { useState } from "react";
import Container from "./Container";
import Items from "./Item";
import Item from "./Item";
import { Button, Form, Input, Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCreateTaskMutation } from "../api/taskApi";
import { CreateTaskReq, CreateTaskRes } from "../type/task";
export type DNDItem = {
  task_id: UniqueIdentifier;
  title: string;
  status: string;
  user_name: string;
  img: string;
  created_at: string;
};

type DNDType = {
  title: string;
  status_type: string;
  items: DNDItem[];
};

const dataContainer: DNDType[] = [
  {
    title: "NEW",
    status_type: "NEW",
    items: [],
  },
  {
    title: "PROCESS",
    status_type: "PROCCESS",
    items: [],
  },
  {
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
  const [createTaskMutation] = useCreateTaskMutation();
  //DND Handlers
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
    const { active, over } = e;
    if (!active && !over) return;
  };
  const handleDragEnd = () => {};
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
    <div className="flex justify-around items-center w-full h-full ">
      <Button onClick={() => setcreateModalOpen(true)}>タスク作成</Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {containers.map((container, i) => {
          return (
            <Container
              key={i}
              title={container.title}
              id={i}
              onAddItem={() => {}}
            >
              <SortableContext
                items={container.items.map((item) => item.task_id)}
              >
                {container.items.map((item) => {
                  return <Item key={item.task_id} item={item}></Item>;
                })}
              </SortableContext>
            </Container>
          );
        })}
      </DndContext>
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
