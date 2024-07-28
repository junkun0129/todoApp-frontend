import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// DnD
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
import Container from "./Container";
import Items from "./Item";
import { DNDType } from "../../pages/TaskManagePage";
import {
  ChangeStatusAndOrderBody,
  ChangeStatusAndOrderReq,
  CreateTaskReq,
  GetTaskDetailReq,
  GetTaskDetailRes,
  TaskDetail,
  UpdateTaskReq,
  UpdateTaskRes,
} from "../../type/task";
import {
  useChangeStatusAndOrderMutation,
  useCreateTaskMutation,
  useGetTaskDetailMutation,
  useGetTaskListQuery,
  useUpdateTaskMutation,
} from "../../api/taskApi";
import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import TaskDetailModal from "../modal/TaskDetailModal";

// Components

type Props = {
  dataSource: DNDType[];
};
export default function TaskPanel({ dataSource }) {
  const [containers, setContainers] = useState<DNDType[]>(dataSource);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [selectedCategory, setselectedCategory] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [taskTitle, settaskTitle] = useState<string | null>(null);
  const [taskBody, settaskBody] = useState<string | null>(null);
  const [updateStatAndOrderMutation] = useChangeStatusAndOrderMutation();
  const [itemEditModalOpen, setitemEditModalOpen] = useState<boolean>(false);
  const [selectedTaskId, setselectedTaskId] = useState<string | null>(null);
  const [updateTaskMutation] = useUpdateTaskMutation();
  const { refetch } = useGetTaskListQuery();
  const [createTaskMutation] = useCreateTaskMutation();
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

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  useEffect(() => {
    console.log("object");
  }, [containers]);
  // DND Handlers
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    // Handle Items Sorting
    if (
      active &&
      over &&
      !active.id.toString().includes("container") &&
      !over?.id.toString().includes("container") &&
      active.id !== over.id
    ) {
      console.log("object");
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
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
        console.log("object");
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

    // Handling Item Drop Into a Container
    if (
      active &&
      over &&
      !active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active.id !== over.id
    ) {
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
  };

  function getNextOrder(event: DragEndEvent) {
    const items: string[] = event.active.data.current.sortable.items;
    const active = event.active;

    const activeIndex = items.findIndex((item) => item === activeId);
    const oneBeforeItem = findItem(items[activeIndex - 1]);
    const container = findValueOfItems(activeId, "item");
    const body: ChangeStatusAndOrderBody = {
      order: oneBeforeItem ? oneBeforeItem.task_order + 1 : 1,
      task_id: active.id as string,
      status: container.status_type,
    };
    return body;
  }
  useEffect(() => {
    console.log(containers);
  }, [containers]);
  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // Handling item Sorting
    const body = getNextOrder(event);
    const request: ChangeStatusAndOrderReq = {
      body: body as ChangeStatusAndOrderBody,
    };
    updateStatAndOrderMutation(request).then((res: any) => {});
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

  const updateStatusAndOrder = async (body: ChangeStatusAndOrderBody) => {
    const request: ChangeStatusAndOrderReq = {
      body,
    };

    const res = await updateStatAndOrderMutation(request);
    console.log(res);
  };

  // Container Component の追加も検討
  const onItemClick = async (id: string) => {
    setitemEditModalOpen(true);
    setselectedTaskId(id);
  };
  const onCloseItemDetail = () => {
    setselectedTaskId(null);
    setitemEditModalOpen(false);
  };

  const handleCancelAddModal = () => {
    setselectedCategory(null);
    setShowAddItemModal(false);
    settaskTitle(null);
    settaskBody(null);
  };

  const handleCreateTask = async () => {
    console.log("object");
    const title = taskTitle;
    const body = taskBody;
    if (!title || !body || !selectedCategory) return;
    //ここで使う
    const request: CreateTaskReq = {
      body: {
        title,
        body,
        status: selectedCategory,
      },
    };
    const response = await createTaskMutation(request);
    refetch();
    handleCancelAddModal();
  };

  const onClickAddButton = (category: string) => {
    setselectedCategory(category);
    setShowAddItemModal(true);
  };
  return (
    <div className="mx-auto max-w-7xl">
      {/* Add Container Modal */}

      {/* Add Item Modal */}

      {!!selectedTaskId && (
        <TaskDetailModal
          ModalProps={{ open: itemEditModalOpen, onCancel: onCloseItemDetail }}
          selectedTaskId={selectedTaskId}
        />
      )}

      <div className="">
        <div className="flex">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <Container
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  onAddItem={() => onClickAddButton(container.status_type)}
                >
                  <SortableContext
                    items={container.items.map((i) => i.task_id)}
                  >
                    <div className=" flex items-start flex-col gap-y-4 h-[300px] overflow-auto">
                      {container.items.map((i) => (
                        <Items
                          onClick={() => onItemClick(i.task_id as string)}
                          title={i.title}
                          id={i.task_id}
                          key={i.task_id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && !activeId.toString().includes("container") && (
                <Items id={activeId} title={findItemTitle(activeId)} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <Container id={activeId} title={findContainerTitle(activeId)}>
                  {findContainerItems(activeId).map((i) => (
                    <Items key={i.task_id} title={i.title} id={i.task_id} />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      <Modal
        title={"タスクの作成"}
        destroyOnClose
        open={showAddItemModal}
        onOk={handleCreateTask}
        onCancel={handleCancelAddModal}
      >
        <div className="">
          <div>タイトル:</div>
          <Input
            value={taskTitle}
            onChange={(e) => settaskTitle(e.target.value)}
          />
        </div>
        <div className="">
          <div>説明:</div>
          <TextArea
            value={taskBody}
            onChange={(e) => settaskBody(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
