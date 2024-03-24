import { Button, Card, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import TextArea from "antd/es/input/TextArea";
import { setGrouSelectedKey } from "../slice/selectSlice";
import { useGetTaskDetailMutation } from "../api/taskApi";

const TaskDetail = () => {
  const { selectedGroupkey } = useAppSelector((state) => state.selectReducer);
  const [form] = Form.useForm();
  const [getDetailMutation] = useGetTaskDetailMutation();
  const [dataSource, setdataSource] = useState<any>();
  const dispatch = useAppDispatch();

  const getDetail = (id: number) => {
    getDetailMutation(id).then((res: any) => {
      console.log("object", res);
      if (res.error) {
      } else {
        if (res.data.result === "success") {
          setdataSource(res.data.data);
        }
      }
    });
  };

  useEffect(() => {
    if (selectedGroupkey) {
      console.log("object");
      console.log(selectedGroupkey);
      getDetail(selectedGroupkey);
    }
  }, [selectedGroupkey]);

  useEffect(() => {
    console.log(dataSource);
  }, [dataSource]);

  return (
    <Card style={{ width: "45%", height: "95%", position: "relative" }}>
      <h2>タスク詳細</h2>
      {dataSource?.title}
      <Form form={form} style={{ marginTop: "30px" }}>
        <Form.Item name={"title"} label={"タイトル"}>
          <Input defaultValue={dataSource?.title} />
        </Form.Item>
        <Form.Item name={"description"} label={"説明"}>
          <TextArea />
        </Form.Item>
        <Form.Item name={"label"} label={"ラベル"}>
          <Select
            options={[
              { value: "new", label: "new" },
              { value: "in_process", label: "in_process" },
              { value: "done", label: "done" },
            ]}
          ></Select>
        </Form.Item>
        <Button
          style={{
            position: "absolute",
            right: "0px",
            bottom: "0px",
            margin: "50px",
          }}
          type="primary"
        >
          保存
        </Button>
      </Form>
      <Button
        style={{
          position: "absolute",
          right: "0px",
          top: "0px",
          margin: "5px",
        }}
        type="text"
        onClick={() => dispatch(setGrouSelectedKey(null))}
      >
        ✕
      </Button>
    </Card>
  );
};

export default TaskDetail;
