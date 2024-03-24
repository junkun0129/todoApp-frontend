import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Tooltip,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../store/store";
import {
  useCreateTaskGroupMutation,
  useCreateTaskMutation,
  useDeleteTaskGroupMutation,
  useGetTaskListQuery,
} from "../api/taskApi";
import {
  CreateTaskGroupRequest,
  CreateTaskGroupResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskGroupRequest,
  DeleteTaskGroupResponse,
} from "../type/api/task";
import { TaskGroup } from "../type/task";
import { AnimatePresence, motion } from "framer-motion";
import TodoCard from "../component/card/TodoCard";

const TodoManage = () => {
  const { data: taskGroupList, isSuccess, refetch } = useGetTaskListQuery();
  const [createTaskGroupMutation] = useCreateTaskGroupMutation();
  const [createTask] = useCreateTaskMutation();
  const [deleteGroupMutation] = useDeleteTaskGroupMutation();

  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  const [form] = Form.useForm();
  const taskNameRef = useRef<string | null>(null);
  const [dataSource, setdataSource] = useState<TaskGroup[]>();
  const [inputShowKey, setinputShowKey] = useState<number | null>(null);
  const [isCreateTaskGroupModalOpen, setisCreateTaskGroupModalOpen] =
    useState<boolean>(false);
  const [openKeys, setopenKeys] = useState<number[]>([]);
  const [showButtonKey, setshowButtonKey] = useState<number | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setdataSource(taskGroupList.data);
    }
  }, [taskGroupList]);

  const handleCreateTaskGroup = async () => {
    const { name } = await form.validateFields();
    const request: CreateTaskGroupRequest = {
      body: {
        name,
      },
    };

    createTaskGroupMutation(request).then((res: any) => {
      if (res.error) {
      } else {
        const response = res.data as CreateTaskGroupResponse;
        if (response.result === "success") {
          setisCreateTaskGroupModalOpen(false);
          form.resetFields();
          refetch();
        }
      }
    });
  };

  const handlePlusClick = (id: number) => {
    if (!openKeys.includes(id)) {
      setopenKeys((pre) => [...pre, id]);
    }
    setinputShowKey(id);
  };

  const handleBlur = (taskgroup_id) => {
    if (taskNameRef.current) {
      const request: CreateTaskRequest = {
        body: {
          user_id: user.user_id,
          taskgroup_id,
          title: taskNameRef.current,
          description: "",
        },
      };
      createTask(request).then((res: any) => {
        if (res.error) {
        } else {
          const response = res.data as CreateTaskResponse;
          if (response.result === "success") {
            message.success("タスクが作成されました");
          }
        }
        setinputShowKey(null);
        taskNameRef.current = null;
        refetch();
      });
    } else {
      setinputShowKey(null);
      const filtered = openKeys.filter((item) => item !== taskgroup_id);
      setopenKeys(filtered);
    }
  };

  const handleOpenClick = (group_id: number) => {
    if (openKeys.includes(group_id)) {
      const filtered = openKeys.filter((item) => item !== group_id);
      setopenKeys(filtered);
    } else {
      setopenKeys((pre) => [...pre, group_id]);
    }
  };

  const handleDeleteGroup = (id: number) => {
    const request: DeleteTaskGroupRequest = {
      body: {
        id,
      },
    };
    deleteGroupMutation(request).then((res: any) => {
      if (res.error) {
      } else {
        const response = res.data as DeleteTaskGroupResponse;
        if (response.result === "success") {
          message.success("タスクグループが削除されました");
        } else {
          message.error(response.message);
        }
        refetch();
      }
    });
  };
  return (
    <Card style={{ margin: 10, width: "45%", height: "95%", overflow: "auto" }}>
      <Space>
        <h2>Todoリスト</h2>
        <Button
          type="primary"
          onClick={() => setisCreateTaskGroupModalOpen(true)}
          icon={<PlusOutlined />}
        >
          タスクグループの作成
        </Button>
      </Space>
      <div>
        <AnimatePresence>
          {dataSource?.map((group, i) => {
            return (
              <div key={i} style={{ marginTop: "10px" }}>
                <motion.div
                  onMouseEnter={() => {
                    setshowButtonKey(group.taskgroup_id);
                  }}
                  onMouseLeave={() => {
                    setshowButtonKey(null);
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <motion.div
                    animate={
                      openKeys.includes(group.taskgroup_id)
                        ? { rotate: 90 }
                        : { rotate: 0 }
                    }
                  >
                    <Button
                      onClick={() => handleOpenClick(group.taskgroup_id)}
                      style={{ opacity: group.tasks.length ? "100" : "0" }}
                      size="small"
                    >
                      {">"}
                    </Button>
                  </motion.div>
                  <div style={{ fontSize: "1.2rem", marginLeft: "10px" }}>
                    {group.name}
                  </div>
                  <motion.div
                    animate={
                      showButtonKey === group.taskgroup_id
                        ? { opacity: "100" }
                        : { opacity: "0" }
                    }
                    transition={{ duration: 0.5 }}
                    style={{ marginTop: "4px" }}
                  >
                    <Tooltip title={"タスクを作成"}>
                      <Button
                        onClick={() => handlePlusClick(group.taskgroup_id)}
                        size="small"
                        type={"text"}
                        icon={<PlusOutlined />}
                      ></Button>
                    </Tooltip>
                  </motion.div>
                  <motion.div
                    animate={
                      showButtonKey === group.taskgroup_id
                        ? { opacity: "100" }
                        : { opacity: "0" }
                    }
                    transition={{ duration: 0.5 }}
                    style={{ marginTop: "4px" }}
                  >
                    <Tooltip title={"タスクグループを削除"}>
                      <Button
                        onClick={() => handleDeleteGroup(group.taskgroup_id)}
                        size="small"
                        type={"text"}
                        icon={<DeleteOutlined />}
                      ></Button>
                    </Tooltip>
                  </motion.div>
                </motion.div>

                <motion.div
                  exit={{ scale: 0.9 }}
                  style={{ marginLeft: "23px" }}
                >
                  {inputShowKey === group.taskgroup_id && (
                    <motion.div
                      key={group.taskgroup_id.toString()}
                      animate={{ y: [5, 0], transition: { duration: 0.2 } }}
                      style={{ marginBottom: "10px", marginTop: "10px" }}
                    >
                      <Input
                        onChange={(e) => (taskNameRef.current = e.target.value)}
                        autoFocus
                        onBlur={() => handleBlur(group.taskgroup_id)}
                        style={{ width: "200px" }}
                        size="small"
                      ></Input>
                    </motion.div>
                  )}
                  {openKeys.includes(group.taskgroup_id) && (
                    <>
                      <AnimatePresence>
                        {group.tasks.length !== 0 &&
                          group.tasks.map((task, j) => {
                            return <TodoCard task={task} />;
                          })}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
      <Modal
        okText={"作成"}
        cancelText={"キャンセル"}
        open={isCreateTaskGroupModalOpen}
        onCancel={() => setisCreateTaskGroupModalOpen(false)}
        onOk={handleCreateTaskGroup}
        title={"タスクグループの作成"}
      >
        <Form style={{ marginTop: "30px" }} form={form}>
          <Form.Item name={"name"} label={"タスクグループ名"}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TodoManage;
