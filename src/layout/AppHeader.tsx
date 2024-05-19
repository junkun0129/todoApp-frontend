import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useAppSelector } from "../store/store";
import { themeColor } from "../constants/style.const";
import { Image } from "antd";
import { User } from "../type/user";
import { getUserColor } from "../util/util";
import UserImage from "../component/imagecontainer/UserImage";
import HeaderPanel from "../component/panel/HeaderPanel";

const AppHeader = () => {
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  return (
    <Header
      style={{ backgroundColor: themeColor.layoutBg }}
      className={`w-full flex items-center justify-end`}
    >
      <HeaderPanel user={user} />
    </Header>
  );
};

export default AppHeader;
