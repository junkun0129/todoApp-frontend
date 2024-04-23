import { Button, Form, Input, message } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../component/svg/Logo";
import { useSignupMutation } from "../api/authApi";
import { SignUpReq } from "../type/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [signupMutation] = useSignupMutation();
  const handleSubmit = (values: Record<string, any>) => {
    console.log(values);
    try {
      const request: SignUpReq = {
        body: values as any,
      };
      signupMutation(request).then((res: any) => {
        if (res.error) {
        } else {
          console.log(res);
        }
      });
    } catch (err) {}
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
          <Form.Item
            rules={[{ required: true }]}
            label="ユーザーネーム"
            name="user_name"
          >
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
