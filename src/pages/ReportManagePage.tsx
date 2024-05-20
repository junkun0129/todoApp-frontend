import { Button, Calendar, Card, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useGetReportsQuery } from "../api/reportApi";
import { ReportList } from "../type/report";
import { useGetUserListQuery } from "../api/userApi";
import { User } from "../type/user";
import { motion } from "framer-motion";
import { themeColor } from "../constants/style.const";
import UserImage from "../component/imagecontainer/UserImage";
import { useNavigate } from "react-router-dom";
import AppCard from "../component/card/AppCard";

const ReportManagePage = () => {
  const circleR = 70;
  const maxHour = 8;
  const navigate = useNavigate();
  const [selectedUser, setselectedUser] = useState<string | null>(null);

  const [ReportDetail, setReportDetail] = useState<ReportList | null>(null);
  const [isDetailModalOpen, setisDetailModalOpen] = useState<boolean>(false);
  const [userList, setuserList] = useState<User[]>([]);
  const { data: userListData, isSuccess: isUserListSuccess } =
    useGetUserListQuery();
  const [dataSource, setdataSource] = useState<ReportList[]>([]);

  useEffect(() => {
    if (!isUserListSuccess) return;
    setuserList(userListData.data);
    console.log(userListData.data);
  }, [userListData]);

  const onUserClick = (user: User) => {
    console.log(user);
    navigate("/report/" + user.user_id);
  };
  //utils
  function calculatePointCoordinates(value: number) {
    const radius = circleR;
    const centerX = circleR;
    const centerY = circleR;
    const angle = ((2 * Math.PI) / maxHour) * (value - 1);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  }

  return (
    <div className=" relative flex w-full h-full items-center ">
      <div className="w-full h-[88%] flex justify-around items-center">
        <Card
          style={{
            backgroundColor: themeColor.cardBg,
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
          }}
          className="w-[47%]"
        >
          <div className="h-[20%]">
            <div className="flex justify-between">
              <div style={{ fontSize: "1rem" }}>ユーザー一覧</div>
              <Button style={{ border: "2px #88A589 solid", color: "#88A589" }}>
                フィルター
              </Button>
            </div>
            <div className="overflow-scroll h-[400px]">
              {!!userList.length &&
                userList.map((user, i) => {
                  return (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={"userlist-" + i}
                      className="flex justify-center"
                      onTap={() => onUserClick(user)}
                    >
                      <AppCard
                        key={"userlist-" + i}
                        className="mt-3 h-[50px] w-[98%] flex items-center"
                      >
                        <div className="flex items-center">
                          <UserImage
                            name={user.user_name}
                            src={user.img}
                            width={30}
                            height={30}
                          ></UserImage>
                          <div className="ml-4">{user.user_name}</div>
                        </div>
                      </AppCard>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </Card>
        <div className="w-[47%] h-full flex flex-col justify-between">
          <AppCard
            style={{
              backgroundColor: themeColor.cardBg,
              height: "47%",
              width: "100%",
            }}
          >
            nanika
          </AppCard>
          <AppCard
            style={{
              backgroundColor: themeColor.cardBg,
              height: "47%",
              width: "100%",
            }}
          >
            nanika
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default ReportManagePage;
