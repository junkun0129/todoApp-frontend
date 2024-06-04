import {
  Button,
  Card,
  Form,
  FormProps,
  Input,
  InputRef,
  Modal,
  ModalProps,
} from "antd";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  CreateTaskCommentReq,
  GetTaskDetailReq,
  GetTaskDetailRes,
  TaskDetail,
} from "../../type/task";
import UserImage from "../imagecontainer/UserImage";
import { useAppSelector } from "../../store/store";
import {
  useCreateTaskCommentMutation,
  useGetTaskDetailMutation,
} from "../../api/taskApi";
import { formatDate } from "../../util/util";
type Props = {
  ModalProps: ModalProps;
  selectedTaskId: string;
};
const TaskDetailModal = ({ ModalProps, selectedTaskId }: Props) => {
  const [getTaskDetailMutation] = useGetTaskDetailMutation();
  const [createCommentMutation] = useCreateTaskCommentMutation();
  const [taskDetail, settaskDetail] = useState<TaskDetail>();
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const request: GetTaskDetailReq = {
      body: {
        task_id: selectedTaskId,
      },
    };
    const response: any = await getTaskDetailMutation(request);
    const data: GetTaskDetailRes = response.data;
    if (data.result === "failed") return;
    settaskDetail(data.data);
  };

  const handleSubmit: FormProps["onFinish"] = async (values: string) => {
    console.log(values);
    console.log(user);
    if (!taskDetail) return;
    const request: CreateTaskCommentReq = {
      body: {
        user_id: user.user_id,
        task_id: taskDetail.task_id,
        body: values["value"] as string,
      },
    };

    const response = await createCommentMutation(request);
    getDetail();
    console.log(response);
  };

  const CustomPanel = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => {
    return (
      <>
        <div>{title}</div>
        <div
          style={{ backgroundColor: "#EBEBEB" }}
          className="flex justify-between rounded px-3 py-2"
        >
          {children}
        </div>
      </>
    );
  };

  return (
    <Modal {...ModalProps} footer={<div></div>} width={"70%"}>
      {!!taskDetail && (
        <>
          <div style={{ fontSize: "2rem" }}>{taskDetail.title}</div>
          <div>
            <CustomPanel title={"ステータス"}>
              <div>作成者：{taskDetail.user_name}</div>
              <div>作成日時：{formatDate(taskDetail.created_at)}</div>
              <div>ステータス：{taskDetail.status}</div>
            </CustomPanel>
            <CustomPanel title="詳細">
              <div>{taskDetail.body}</div>
            </CustomPanel>
            <CustomPanel title={"アクティビティー"}>
              <div className="h-full w-full ">
                <div className="flex flex-col items-end p-5 max-h-[300px] overflow-auto">
                  {taskDetail.comments.length > 0 &&
                    taskDetail.comments.map((comment, i) => {
                      const {
                        taskcomment_id,
                        body,
                        img,
                        user_name,
                        created_at,
                      } = comment;
                      const formattedDate = formatDate(created_at);
                      console.log(formattedDate);
                      return (
                        <div
                          className="flex items-center my-2"
                          key={"taskcomment-" + i}
                        >
                          <div className="mr-2">
                            <div className="flex justify-end items-center">
                              <div
                                className="mr-1 mt-1"
                                style={{ color: "#8C8C8C", fontSize: "0.5rem" }}
                              >
                                {formattedDate}
                              </div>
                              <div>{user_name}</div>
                            </div>
                            <div>{body}</div>
                          </div>
                          <UserImage
                            name={user_name}
                            src={img}
                            width={35}
                            height={35}
                          />
                        </div>
                      );
                    })}
                </div>
                <Form className="flex w-full" onFinish={handleSubmit}>
                  <UserImage
                    name={user.user_name}
                    src={user.img}
                    width={30}
                    height={30}
                  />
                  <Form.Item name={"value"} className="ml-3 w-full h-0">
                    <Input />
                  </Form.Item>
                  <Button htmlType="submit" type="primary" className="ml-2">
                    送信
                  </Button>
                </Form>
              </div>
            </CustomPanel>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TaskDetailModal;
