import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import AppCard from "../card/AppCard";
import { Button } from "antd";
type ContainerProps = {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
};

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
  const { setNodeRef: droppableRef } = useDroppable({
    id,
    data: { type: "container" },
  });
  return (
    <div
      {...attributes}
      ref={droppableRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-[400px] p-4 rounded-xl flex flex-col gap-y-4",
        isDragging && "opacity-50"
      )}
    >
      <AppCard bgColor="#F4F4F4">
        <div className="flex items-center justify-between">
          <div className="flex gap-y-1 items-center mb-4">
            <h1 className="text-gray-800 text-xl mr-2 ">{title}</h1>
            <Button type="primary" size="small" onClick={onAddItem}>
              +
            </Button>
          </div>
        </div>

        {children}
      </AppCard>
    </div>
  );
};

export default Container;
