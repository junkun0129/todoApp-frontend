import { PlusOutlined } from "@ant-design/icons";
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
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import TodoCard from "../component/card/TodoCard";
import { Task } from "../type/task";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setLogout } from "../slice/authSlice";
import TextArea from "antd/es/input/TextArea";
import { useGetTaskListQuery } from "../api/taskApi";

const TodoManage = () => {
  const [dataSource, setdataSource] = useState<Task[]>();
  const [isOpenCreateModal, setisOpenCreateModal] = useState<boolean>(false);
  const TaskList = useGetTaskListQuery();
  const token = useAppSelector(
    (state) => state.persistedReducer.AuthReducer.token
  );
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (token) {
      TaskList.refetch();
    }
  }, [token]);

  useEffect(() => {
    if (TaskList.isSuccess) {
      setdataSource(TaskList.data.data);
    }
  }, [TaskList.data]);

  const createTask = async () => {
    const { title, description } = await form.validateFields();

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description: description ?? "" }),
    };
    fetch(`${import.meta.env.VITE_API_URL}/task/create`, options)
      .then((res: any) => {
        if (res.status === 401) {
          dispatch(setLogout());
        }
        if (!res.ok) {
        } else {
          return res.json();
        }
      })
      .then((data: any) => {
        if (data.result === "success") {
          TaskList.refetch();
          setisOpenCreateModal(false);
          form.resetFields();
          message.success("新タスクが作成されました");
        }
      });
  };
  return (
    <Card style={{ margin: 10, width: "50%", height: "95%", overflow: "auto" }}>
      {dataSource ? (
        <>
          <Space
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Todoリスト</h2>

            <Tooltip title={"タスクの作成"}>
              <Button
                onClick={() => setisOpenCreateModal(true)}
                size="middle"
                icon={<PlusOutlined />}
                type="primary"
              ></Button>
            </Tooltip>
          </Space>
          <AnimatePresence>
            {dataSource.map((item, i) => (
              <TodoCard task={item}></TodoCard>
            ))}
          </AnimatePresence>
        </>
      ) : (
        <div>Loading....</div>
      )}
      <Modal
        okText="作成"
        cancelText="キャンセル"
        onCancel={() => {
          setisOpenCreateModal(false);
          form.resetFields();
        }}
        onOk={createTask}
        title="タスクの新規作成"
        open={isOpenCreateModal}
      >
        <Form form={form}>
          <Form.Item
            rules={[{ required: true, message: "必須項目です" }]}
            name={"title"}
            label={"タイトル"}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item name={"description"} label={"説明"}>
            <TextArea></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TodoManage;
