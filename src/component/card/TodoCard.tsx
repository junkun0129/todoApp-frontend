import { Button, Card, message, Image } from "antd";
import { Task } from "../../type/task";
import { useDeleteTaskMutation, useGetTaskListQuery } from "../../api/taskApi";
import { DeleteTaskRequest, DeleteTaskResponse } from "../../type/api/task";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../store/store";
import { setGrouSelectedKey } from "../../slice/selectSlice";
type Props = {
  task: Task;
};
const TodoCard = ({ task }: Props) => {
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const { refetch } = useGetTaskListQuery();
  const dispatch = useAppDispatch();
  const handleDeleteTask = () => {
    const request: DeleteTaskRequest = {
      body: {
        id: task.task_id,
      },
    };

    deleteTaskMutation(request).then((res: any) => {
      if (res.error) {
      } else {
        const response = res.data as DeleteTaskResponse;
        if (response.result === "success") {
          message.success(`"${task.title}"が削除されました`);
          refetch();
        }
      }
    });
  };
  return (
    <motion.div
      key={task.task_id.toString()}
      animate={{ y: [10, 0] }}
      exit={{ y: -50, opacity: 0, transition: { duration: 0.2 } }}
      style={{ cursor: "pointer", marginTop: "10px" }}
      whileHover={{ scale: 1.05 }}
      onClick={() => dispatch(setGrouSelectedKey(task.task_id))}
    >
      <Card
        style={{
          backgroundColor: "#EBE1D1",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-6px",
            bottom: "-6px",
            backgroundColor: "white",
            padding: "5px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "#E0C69F",
              padding: "10px",
              borderRadius: "7px",
            }}
          >
            {" "}
            作成日:{formatDateToJapanese(task.created_at)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <div>タイトル:{task.title}</div>
            <div>
              ラベル:
              <span
                style={{
                  backgroundColor: "#E3D4BF",
                  borderRadius: "4px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  paddingTop: "3px",
                  paddingBottom: "3px",
                }}
              >
                {task.status}
              </span>
            </div>
            <div>説明:{task.description}</div>
          </div>
          <div>
            <div style={{ display: "flex", marginLeft: "130px" }}>
              <div>作成者 : {task.user_name}</div>
              <Image
                preview={false}
                style={{
                  borderRadius: "20px",
                  objectFit: "contain",
                  marginLeft: "10px",
                  marginTop: "-5px",
                }}
                src={`${import.meta.env.VITE_API_URL}/image/${
                  task.user_img
                }?tm=${
                  new Date().getTime() + Math.floor(Math.random() * 1000000)
                }`}
                width={30}
                height={30}
              ></Image>
            </div>
          </div>
          <Button
            style={{ position: "absolute", right: "0px", top: "0px" }}
            onClick={handleDeleteTask}
            type="text"
            size="small"
          >
            ✕
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TodoCard;

function formatDateToJapanese(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();

  // 日本語表記にフォーマットする
  const formattedDate = `${year}年${month}月${day}日 ${hours}時`;

  return formattedDate;
}
