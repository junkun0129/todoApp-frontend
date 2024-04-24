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
import { Button } from "antd";
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

  return (
    <div className="flex justify-around items-center w-full h-full ">
      <Button>タスク作成</Button>
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
    </div>
  );
};

export default TaskManagePage;
