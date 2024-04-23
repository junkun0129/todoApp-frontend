import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appRoute } from "../constants/routes";

const AppSideBar = () => {
  type MenuItem = Required<MenuProps>["items"][number];
  const items: MenuItem[] = [
    {
      key: appRoute.home,
      label: "ホーム",
    },
    {
      key: "grp-0",
      type: "group",
      label: "日報",
    },
    {
      key: appRoute.reportCreate,
      label: "My日報",
    },
    {
      key: appRoute.reportList,
      label: "日報一覧",
    },
    {
      key: "grp-1",
      type: "group",
      label: "勤怠",
    },
    {
      key: appRoute.attendCreate,
      label: "勤怠入力",
    },
    {
      key: appRoute.attendList,
      label: "勤怠一覧",
    },
    {
      key: "grp-2",
      type: "group",
      label: "ユーザー",
    },
    {
      key: appRoute.userEdit,
      label: "プロフィール編集",
    },
    {
      key: appRoute.userList,
      label: "ユーザー一覧",
    },
    {
      key: appRoute.userContact,
      label: "連絡管理",
    },
  ];
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick: MenuProps["onClick"] = (e) => {
    console.log(e);
    navigate(e.key);
  };

  useEffect(() => {
    console.log(location);
    setselectedKeys([location.pathname]);
  }, [location]);
  return (
    <Sider
      style={{ backgroundColor: "lightcoral" }}
      className={`h-full`}
      trigger={null}
      collapsible
      collapsedWidth={60}
    >
      <Menu
        selectedKeys={selectedKeys}
        onClick={handleClick}
        items={items}
      ></Menu>
    </Sider>
  );
};

export default AppSideBar;
