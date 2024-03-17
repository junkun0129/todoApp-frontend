import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import AppHeader from "../component/header/AppHeader";

const Applayout = () => {
  return (
    <Layout style={{ overflow: "hidden", width: "100vw", height: "100vh" }}>
      <AppHeader></AppHeader>
      <Content>
        <Outlet></Outlet>
      </Content>
    </Layout>
  );
};

export default Applayout;
