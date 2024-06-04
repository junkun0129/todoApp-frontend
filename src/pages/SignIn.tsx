import { Button, Checkbox, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { persistor, useAppDispatch, useAppSelector } from "../store/store";
import { setIsAuth, setToken } from "../slice/authSlice";
import { motion } from "framer-motion";
import Logo from "../component/svg/Logo";
import { setUser } from "../slice/userSlice";
import { useSigninMutation } from "../api/authApi";
import { SignInReq } from "../type/auth";

const SignIn = () => {
  persistor.purge();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isStayLoggedIn, setisStayLoggedIn] = useState<boolean>(false);
  const [signinMutation] = useSigninMutation();
  const { token } = useAppSelector(
    (state) => state.persistedReducer.AuthReducer
  );
  useEffect(() => {
    if (token) {
      dispatch(setIsAuth(true));
    }
  }, [token]);

  const handleSubmit = (values: Record<string, any>) => {
    const request: SignInReq = {
      body: {
        email: values.email,
        password: values.password,
        is_stay_login: isStayLoggedIn,
      },
    };
    signinMutation(request).then((res: any) => {
      if (res.error) {
      } else {
        const response = res.data;
        console.log(response);
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));
        navigate("/");
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
