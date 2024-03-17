import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React from "react";
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
