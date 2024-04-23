import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSideBar from "./AppSideBar";
import { useAppSelector } from "../store/store";
import { appStyle } from "../constants/style.const";
import { useEffect } from "react";

const AppLayout = () => {
  const { screenSize } = useAppSelector(
    (state) => state.persistedReducer.AppReducer
  );
  return (
    <Layout className="w-[100vw] h-[100vh] flex">
      <AppSideBar />
      <div className="w-full h-full">
        <AppHeader />
        <Content
          className={` bg-red-50 w-full `}
          style={{ height: screenSize.y - appStyle.headerHeight }}
        >
          <Outlet />
        </Content>
      </div>
    </Layout>
  );
};

export default AppLayout;
