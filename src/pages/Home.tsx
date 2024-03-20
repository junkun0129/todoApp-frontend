import { useEffect, useState } from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Tooltip,
  message,
} from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import TextArea from "antd/es/input/TextArea";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setLogout } from "../slice/authSlice";
import AppCalendar from "../component/calendar/AppCalendar";
import TodoCard from "../component/card/TodoCard";
import { Task } from "../type/task";
import TodoManage from "../section/TodoManage";

const Home = () => {
  return (
    <ProtectedLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          height: "100%",
        }}
      >
        <TodoManage></TodoManage>
        <Card
          className=" bg-red-500"
          style={{
            margin: 10,
            width: "50%",
            height: "95%",
            overflow: "hidden",
          }}
        ></Card>
      </div>
    </ProtectedLayout>
  );
};

export default Home;
