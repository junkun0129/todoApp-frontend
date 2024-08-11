import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSideBar from "./AppSideBar";
import { useAppSelector } from "../store/store";
import { appStyle, themeColor } from "../constants/style.const";
import { useEffect } from "react";
import BackIcon from "../component/svg/BackIcon";

const AppLayout = () => {
  const { screenSize } = useAppSelector(
    (state) => state.persistedReducer.AppReducer
  );
  const { token } = useAppSelector(
    (state) => state.persistedReducer.AuthReducer
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) {
      console.log(token, "tokennn");
      navigate("/signin");
    }
  }, [token]);

  return (
    <Layout className="w-[100vw] h-[100vh] flex">
      <AppSideBar />
      <div className="w-full h-full">
        <AppHeader />
        <Content
          className={`w-full relative`}
          style={{
            height: screenSize.y - appStyle.headerHeight,
            backgroundColor: themeColor.contentBg,
          }}
        >
          {/* <div className="absolute">
            <BackIcon />
          </div> */}
          <div>
            <Outlet />
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default AppLayout;
