import { Button, Checkbox, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { persistor, useAppDispatch, useAppSelector } from "../store/store";
import { setIsAuth, setToken } from "../slice/authSlice";
import { motion } from "framer-motion";
import Logo from "../component/svg/Logo";
import { setUser } from "../slice/userSlice";

const SignIn = () => {
  persistor.purge();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isStayLoggedIn, setisStayLoggedIn] = useState<boolean>(false);
  const { token } = useAppSelector(
    (state) => state.persistedReducer.AuthReducer
  );
  useEffect(() => {
    if (token) {
      dispatch(setIsAuth(true));
    }
  }, [token]);

  const handleSubmit = (values: Record<string, any>) => {
    console.log(values);
    console.log(isStayLoggedIn);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 送信するデータのタイプ
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        is_stay_login: isStayLoggedIn,
      }), // 送信するデータをJSON形式に変換
    };
    fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, options)
      .then((res: any) => {
        if (!res.ok) {
        } else {
          return res.json();
        }
      })
      .then((data: any) => {
        if (data.result === "success") {
          console.log(data.user);
          console.log(data.data.user);
          console.log(data.data.token);
          dispatch(setUser(data.data.user));
          dispatch(setToken(data.data.token));
          navigate("/");
        } else {
          message.error(data.message);
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
          navigate("/signup");
        }}
      >
        アカウントを作成する
      </Button>
      <motion.div
        style={{
          width: "40%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{ scale: 1.2 }}
      >
        <h1 style={{ marginBottom: "50px" }}>ログイン画面</h1>
        <Form onFinish={handleSubmit}>
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
          <Form.Item
            style={{ display: "flex", justifyContent: "center" }}
            name="is_stay_login"
            label="ログインしたままにする"
          >
            <Checkbox
              onChange={() => setisStayLoggedIn((pre) => !pre)}
              checked={isStayLoggedIn}
            ></Checkbox>
          </Form.Item>
          <Button
            style={{ marginLeft: "100px", marginTop: "30px" }}
            htmlType="submit"
            type="primary"
          >
            ログイン
          </Button>
        </Form>
      </motion.div>
    </div>
  );
};

export default SignIn;
