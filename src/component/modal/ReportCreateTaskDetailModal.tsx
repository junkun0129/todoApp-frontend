import { Button, Modal, ModalProps } from "antd";
import React from "react";
import { DetailedTask } from "../../pages/ReportCreate";
import TextArea from "antd/es/input/TextArea";
type Props = {
  ModalProps?: ModalProps;
  DetailedTask: DetailedTask | null;
  setDetailedTask: (detailedtask: DetailedTask | null) => void;
  onSave: () => void;
};
const ReportCreateTaskDetailModal = ({
  ModalProps,
  DetailedTask,
  setDetailedTask,
  onSave,
}: Props) => {
  const onResultInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const newDetailedTask: DetailedTask = { ...DetailedTask, result: value };
    setDetailedTask(newDetailedTask);
  };

  const onImproveInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const newDetailedTask: DetailedTask = { ...DetailedTask, improve: value };
    setDetailedTask(newDetailedTask);
  };
  const handleCancel = () => {
    setDetailedTask(null);
  };
  return (
    <Modal
      cancelButtonProps={{ type: "primary" }}
      onOk={onSave}
      onCancel={handleCancel}
      okText={"更新"}
      cancelText={"戻る"}
      open={!!DetailedTask}
      {...ModalProps}
      destroyOnClose
    >
      {!!DetailedTask && (
        <div>
          <div>■タスク名：{DetailedTask.title}</div>
          <div className="mt-4">■タスク概要：{DetailedTask.status}</div>
          <div className="mt-4">■結果</div>
          <TextArea
            onChange={onResultInputChange}
            defaultValue={DetailedTask.result}
          />
          <div className="mt-4">■改善</div>
          <TextArea
            onChange={onImproveInputChange}
            defaultValue={DetailedTask.improve}
          />
        </div>
      )}
    </Modal>
  );
};

export default ReportCreateTaskDetailModal;
