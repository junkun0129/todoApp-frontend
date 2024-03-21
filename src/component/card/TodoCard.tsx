import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Space, message } from "antd";
import { Task } from "../../type/task";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setLogout } from "../../slice/authSlice";
import { useGetTaskListQuery } from "../../api/taskApi";
type Props = {
  task: Task;
};
const TodoCard = ({ task }: Props) => {
  const date = new Date(task.created_at);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  };

  const formattedDate = date.toLocaleString("ja-JP", options as any);
  const token = useAppSelector(
    (state) => state.persistedReducer.AuthReducer.token
  );
  const TaskList = useGetTaskListQuery();

  const dispatch = useAppDispatch();
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
          TaskList.refetch();
          message.success("タスクが削除されました");
        }
      });
  };
  return (
    <Card
      style={{
        backgroundColor: "#F1E2D4",
        marginTop: 8,
        position: "relative",
        height: "10%",
      }}
      key={task.task_id.toString()}
    >
      <Space
        style={{
          display: "flex",
          marginTop: "-10px",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "1rem" }}>{`${task.task_id}.`}</div>
        <div style={{ fontSize: "1rem", marginLeft: 10 }}>{task.title}</div>
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
          {task.status}
        </div>
      </Space>

      <div style={{ fontSize: "0.7rem" }}>{task.description}</div>
      <Button
        onClick={() => handleDelete(task.task_id)}
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
  );
};

export default TodoCard;
