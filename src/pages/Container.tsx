import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { ReactNode } from "react";
import { DNDType } from "./TaskManagePage";
import Item from "./Item";
type Props = {
  container: DNDType;
};
const Container = ({ container }: Props) => {
  const { setNodeRef } = useDroppable({
    id: container.id,
    data: { type: "container" },
  });
  return (
    <SortableContext
      id={container.id as string}
      items={container.items.map((item) => item.task_id)}
    >
      <div ref={setNodeRef} className="w-[20%] h-full bg-amber-200">
        <div>{container.title}</div>
        {container.items.map((item, i) => {
          return <Item key={item.task_id} item={item}></Item>;
        })}
      </div>
    </SortableContext>
  );
};

export default Container;
