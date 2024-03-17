import { Button, Form, Input } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../component/svg/Logo";

const SignUp = () => {
  const navigate = useNavigate();
  const handleSubmit = (values: Record<string, any>) => {
    console.log(values);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 送信するデータのタイプ
      },
      body: JSON.stringify(values), // 送信するデータをJSON形式に変換
    };
    fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, options)
      .then((res: any) => {
        if (!res.ok) {
        } else {
          return res.json();
        }
      })
      .then((data: any) => {
        console.log(data);
        if (data.result === "success") {
          navigate("/signin");
        }
      });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EBE1D1",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "30px",
          top: 0,
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Logo></Logo>
        <div style={{ marginLeft: "15px" }}>todo APP</div>
      </div>
      <Button
        style={{
          position: "absolute",
          right: "0px",
          top: "0px",
          margin: "30px",
        }}
        onClick={() => {
          navigate("/signin");
        }}
      >
        ログイン画面へ
      </Button>
      <motion.div
        animate={{ scale: 1.2 }}
        style={{
          width: "40%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ marginBottom: "50px" }}>新規アカウント登録</h1>
        <Form onFinish={handleSubmit}>
          <Form.Item rules={[{ required: true }]} label="姓" name="lastName">
            <Input></Input>
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="名" name="firstName">
            <Input></Input>
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            label="メールアドレス"
            name="email"
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            label="パスワード"
            name="password"
          >
            <Input type="password"></Input>
          </Form.Item>

          <Button
            style={{ marginLeft: "100px", marginTop: "30px" }}
            htmlType="submit"
            type="primary"
          >
            アカウント作成
          </Button>
        </Form>
      </motion.div>
    </div>
  );
};

export default SignUp;
