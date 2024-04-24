import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { ReactNode } from "react";
type Props = {
  id: UniqueIdentifier;
  title: string;
  onAddItem: () => void;
  children: ReactNode;
};
const Container = ({ id, title, onAddItem, children }: Props) => {
  return (
    <div className="w-[20%] h-full bg-amber-200">
      <div>{title}</div>
      {children}
    </div>
  );
};

export default Container;
