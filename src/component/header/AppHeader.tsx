import { Button } from "antd";
import { Header } from "antd/es/layout/layout";
import React from "react";
import { useAppDispatch } from "../../store/store";
import { setLogout } from "../../slice/authSlice";

const AppHeader = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(setLogout());
  };
  return (
    <Header
      style={{
        backgroundColor: "#C3EABA",
        display: "flex",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>TodoApp</h2>
        <Button onClick={handleLogout}>ログアウト</Button>
      </div>
    </Header>
  );
};

export default AppHeader;
