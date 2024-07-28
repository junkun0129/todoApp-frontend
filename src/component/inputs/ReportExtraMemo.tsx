import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
type Props = {
  onTilteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBodyChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDelete: () => void;
};
const ReportExtraMemo = ({ onTilteChange, onBodyChange, onDelete }: Props) => {
  return (
    <div className="w-full my-10">
      <div className="flex w-full items-center">
        <div className="w-[10%]">タイトル：</div>
        <Input
          className="w-[89%] mr-3"
          onChange={onTilteChange}
          style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
        />
        <Button
          style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
          className="w-[30px] h-[30px] flex justify-center items-center"
          onClick={onDelete}
        >
          ✕
        </Button>
      </div>
      <TextArea
        style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
        className="mt-3"
        onChange={onBodyChange}
      />
    </div>
  );
};

export default ReportExtraMemo;
