import React from "react";
import { useCreateReportMutation } from "../api/reportApi";
import { Button, Form, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CreateReportReq } from "../type/report";

const ReportCreatePage = () => {
  const [createReportMutation] = useCreateReportMutation();
  const handleSubmit = (values: Record<string, any>) => {
    console.log(values);
    const request: CreateReportReq = {
      body: values as any,
    };

    createReportMutation(request).then((res: any) => {
      if (res.error) {
      } else {
        const response = res.data;
        message.success("成功しました");
      }
    });
  };
  return (
    <div>
      <div>
        <Form onFinish={handleSubmit}>
          <Form.Item label="ヘッダー" name={"title"}>
            <Input />
          </Form.Item>
          <Form.Item label="本文" name={"body"}>
            <TextArea />
          </Form.Item>
          <Button htmlType="submit">送信</Button>
        </Form>
      </div>
    </div>
  );
};

export default ReportCreatePage;
