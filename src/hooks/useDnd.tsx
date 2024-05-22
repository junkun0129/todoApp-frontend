import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DNDType } from "../pages/TaskManagePage";
import Container from "../component/panel/Container";
import Items from "../component/panel/Item";
type Props = {
  dataSource: DNDType[];
};
const useDnd = ({ dataSource }: Props) => {
  const [containers, setContainers] = useState<DNDType[]>(dataSource);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container.items.find((item) => item.task_id === id)
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.task_id === id);
    if (!item) return "";
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.items;
  };
  const findItem = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return null;
    const item = container.items.find((item) => item.task_id === id);
    if (!item) return null;
    return item;
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  // DND Handlers
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.task_id === active.id
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.task_id === over.id
      );

      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeItemIndex,
          overItemIndex
        );
        setContainers(newItems);
      } else {
        const newItems = [...containers];
        const [removedItem] = newItems[activeContainerIndex].items.splice(
          activeItemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overItemIndex,
          0,
          removedItem
        );
        setContainers(newItems);
      }
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (
      active &&
      over &&
      !active.id.toString().includes("container") &&
      !over?.id.toString().includes("container") &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");
      // If the active or over container is not found, return
      console.log(activeContainer, OverconstrainedError);
      if (!activeContainer || !overContainer) return;
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.task_id === active.id
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.task_id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeItemIndex,
          overItemIndex
        );
        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removedItem] = newItems[activeContainerIndex].items.splice(
          activeItemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overItemIndex,
          0,
          removedItem
        );
        setContainers(newItems);
      }
      // const body: ChangeStatusAndOrderBody = {
      //   task_id: active.id as string,
      // };
    }
    // Handling item dropping into Container
    if (
      active &&
      over &&
      !active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active.id !== over.id
    ) {
      console.log("object");
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");
      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.task_id === active.id
      );
      let newItems = [...containers];
      const [removedItem] = newItems[activeContainerIndex].items.splice(
        activeItemIndex,
        1
      );
      overContainer.items.push(removedItem); // Always add the item to the over container
      setContainers(newItems);
    }
    setActiveId(null);
  };
  useEffect(() => {
    console.log(activeId);
  }, [activeId]);
  const TaskManagePanel = () => {
    return (
      <div className="flex">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
        >
          <SortableContext items={containers.map((i) => i.id)}>
            {containers.map((container, j) => {
              return (
                <Container
                  key={"taskcontainer-" + j}
                  id={container.id}
                  title={container.title}
                >
                  <SortableContext
                    items={container.items.map((i) => i.task_id)}
                  >
                    <div className=" flex items-start flex-col gap-y-4 h-[300px] overflow-auto">
                      {container.items.map((item, i) => {
                        return (
                          <Items
                            title={item.title}
                            id={item.task_id}
                            key={"taskitem-" + i}
                          ></Items>
                        );
                      })}
                    </div>
                  </SortableContext>
                </Container>
              );
            })}
          </SortableContext>
          <DragOverlay adjustScale={false}>
            {/* Drag Overlay For item Item */}
            {activeId && !activeId.toString().includes("container") && (
              <Items id={activeId} title={findItemTitle(activeId)} />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    );
  };
  return { TaskManagePanel };
};

export default useDnd;
