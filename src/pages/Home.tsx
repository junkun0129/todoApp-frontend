import { useEffect, useState } from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
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
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import TextArea from "antd/es/input/TextArea";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setLogout } from "../slice/authSlice";
type Task = {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
};
const Home = () => {
  const [dataSource, setdataSource] = useState<Task[]>();
  const [isOpenCreateModal, setisOpenCreateModal] = useState<boolean>(false);
  const token = useAppSelector((state) => state.AuthReducer.token);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  useEffect(() => {
    if (token) {
      updateList();
    }
  }, [token]);

  const updateList = () => {
    console.log(token);
    fetch(`${import.meta.env.VITE_API_URL}/task/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
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
        console.log(data);
        setdataSource(data.data);
      });
  };

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
          updateList();
          setisOpenCreateModal(false);
          form.resetFields();
          message.success("新タスクが作成されました");
        }
      });
  };

  const handleDelete = (id: number) => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    };
    fetch(`${import.meta.env.VITE_API_URL}/task/delete`, options)
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
          updateList();
          message.success("タスクが削除されました");
        }
      });
  };
  return (
    <ProtectedLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          height: "100%",
        }}
      >
        <Card
          style={{ margin: 10, width: "50%", height: "95%", overflow: "auto" }}
        >
          {dataSource ? (
            <>
              <Space
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{}}>Todoリスト</h2>

                <Tooltip title={"タスクの作成"}>
                  <Button
                    onClick={() => setisOpenCreateModal(true)}
                    size="middle"
                    style={{}}
                    icon={<PlusOutlined />}
                    type="primary"
                  ></Button>
                </Tooltip>
              </Space>
              {dataSource.map((item, i) => {
                const date = new Date(item.created_at);
                const options = {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Tokyo",
                };

                const formattedDate = date.toLocaleString(
                  "ja-JP",
                  options as any
                );
                return (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card
                      style={{
                        backgroundColor: "#F1E2D4",
                        marginTop: 8,
                        position: "relative",
                        height: "10%",
                      }}
                      key={i}
                    >
                      <Space
                        style={{
                          display: "flex",
                          marginTop: "-10px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{ fontSize: "1rem" }}
                        >{`${item.task_id}.`}</div>
                        <div style={{ fontSize: "1rem", marginLeft: 10 }}>
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            backgroundColor: "#FFF6EE",
                            padding: "3px",
                            borderRadius: "5px",
                            // position: "absolute",
                            // top: "7px",
                            // right: "15%",
                          }}
                        >
                          {item.status}
                        </div>
                      </Space>

                      <div style={{ fontSize: "0.7rem" }}>
                        {item.description}
                      </div>
                      <Button
                        onClick={() => handleDelete(item.task_id)}
                        icon={<CloseOutlined />}
                        type="text"
                        size="small"
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                        }}
                      ></Button>

                      <div
                        style={{
                          position: "absolute",
                          right: "0px",
                          bottom: "0px",
                          borderRadius: "10px",
                          padding: "5px",
                          marginRight: "-5px",
                          marginBottom: "-6px",
                          backgroundColor: "white",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ECD3BC",
                            padding: "10px",
                            borderRadius: "7px",
                          }}
                        >
                          {`作成日　${formattedDate}`}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <div>Loading....</div>
          )}
        </Card>
        <Card style={{ margin: 10, width: "50%", height: "95%" }}>
          <h1>ダッシュボード</h1>
        </Card>
        <Modal
          okText="作成"
          cancelText="キャンセル"
          onCancel={() => setisOpenCreateModal(false)}
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
      </div>
    </ProtectedLayout>
  );
};

export default Home;
