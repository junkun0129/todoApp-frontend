import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { ReactNode } from "react";
import { DNDItem } from "./TaskManagePage";
type Props = {
  item:DNDItem
};
const Item = ({ item }: Props) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.task_id,
    data: {
      type: "item",
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <div>{item.title}</div>
      <button {...listeners}>drag me</button>
    </div>
  );
};

export default Item;
