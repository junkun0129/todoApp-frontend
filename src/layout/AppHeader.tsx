import { Header } from "antd/es/layout/layout";
import React from "react";
import { useAppSelector } from "../store/store";

const AppHeader = () => {
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  return (
    <Header className={`w-full`}>
      <h1>ユーザー名：{user.user_name}</h1>
      <img src={user.img}></img>
    </Header>
  );
};

export default AppHeader;
