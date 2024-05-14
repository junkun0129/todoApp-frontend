import { Calendar, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useGetReportsQuery } from "../api/reportApi";
import { ReportList } from "../type/report";
import { useGetUserListQuery } from "../api/userApi";
import { User } from "../type/user";
import { motion } from "framer-motion";

const ReportManagePage = () => {
  const circleR = 70;
  const maxHour = 8;
  const [selectedUser, setselectedUser] = useState<string | null>(null);
  const { data, isSuccess, isLoading } = useGetReportsQuery({
    user_id: selectedUser,
  });
  const [ReportDetail, setReportDetail] = useState<ReportList | null>(null);
  const [isDetailModalOpen, setisDetailModalOpen] = useState<boolean>(false);
  const [userList, setuserList] = useState<User[]>([]);
  const { data: userListData, isSuccess: isUserListSuccess } =
    useGetUserListQuery();
  const [dataSource, setdataSource] = useState<ReportList[]>([]);
  useEffect(() => {
    if (!isSuccess) return;
    console.log(data);
    setdataSource(data.data);
  }, [data]);
  useEffect(() => {
    if (!isUserListSuccess) return;
    setuserList(userListData.data);
  }, [userListData]);

  const handleUserClick = (user_id: string) => {
    setselectedUser(user_id);
  };

  const handleReportClick = (i: number) => {
    setisDetailModalOpen(true);
    setReportDetail(dataSource[i]);
  };

  const handleModalCancel = () => {
    setisDetailModalOpen(false);
    setReportDetail(null);
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
    <div className="flex w-full h-full ">
      <div className="w-[20%] bg-blue-200">
        <div className="w-full h-[50%] overflow-auto">
          {userList.length &&
            userList.map((user, i) => (
              <motion.div
                whileHover={{ translateX: 10 }}
                whileTap={{ scale: 1.2 }}
                onTap={() => handleUserClick(user.user_id)}
                className="flex h-[50px] rounded bg-cyan-200 mt-5"
                key={"usernode-" + i}
              >
                <div>{user.user_name}</div>
                <img className={user.img}></img>
              </motion.div>
            ))}
        </div>
        <div className="w-full h-[50%]"></div>
      </div>
      <div className="overflow-auto flex flex-wrap w-[80%] bg-red-100">
        {dataSource &&
          dataSource.map((data, i) => {
            return (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onTap={() => handleReportClick(i)}
                className="w-[200px] h-[200px] ml-5 mt-5 bg-red-300 flex justify-center items-center"
                key={"reportlist" + i}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${circleR * 2} ${circleR * 2}`}
                  className="flex justify-center items-center"
                >
                  <circle cx={circleR} cy={circleR} r={circleR} fill="red" />
                  {data.dailytasks.length &&
                    data.dailytasks.map((dailytask, j) => {
                      const { x: startX, y: startY } =
                        calculatePointCoordinates(dailytask.starttime);
                      const { x: endX, y: endY } = calculatePointCoordinates(
                        dailytask.endtime
                      );

                      return (
                        <g key={j}>
                          <path
                            d={`M ${circleR},${circleR} L ${startX},${startY} A ${circleR},${circleR} 0 0,1 ${endX},${endY} Z`}
                            fill="rgba(0, 0, 0, 0.5)"
                          />
                        </g>
                      );
                    })}
                </svg>
              </motion.div>
            );
          })}
      </div>
      <Modal open={isDetailModalOpen} onCancel={handleModalCancel}>
        <div>{ReportDetail?.report.date}</div>
      </Modal>
    </div>
  );
};

export default ReportManagePage;
