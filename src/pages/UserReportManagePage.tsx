import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppCard from "../component/card/AppCard";
import { useGetReportsQuery } from "../api/reportApi";
import { GetReportRes, PairedReportList } from "../type/report";
import { ReportList } from "../type/report";
import ReportCircle from "../component/datadisplay/ReportCircle";
import ReportReviewCard from "../component/card/ReportReviewCard";
import { useGetProfileQuery } from "../api/userApi";
import { User } from "../type/user";
import UserImage from "../component/imagecontainer/UserImage";
import { Button } from "antd";

const UserReportManagePage = () => {
  const { userId } = useParams();
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const { data, isSuccess } = useGetReportsQuery({ user_id: userId });
  const { data: userData, isSuccess: getUserIsSuccess } =
    useGetProfileQuery(userId);
  const [reportList, setreportList] = useState<PairedReportList[]>([]);
  useEffect(() => {
    if (!isSuccess) return;
    setreportList(data.data);
  }, [data]);

  useEffect(() => {
    if (!getUserIsSuccess) return;
    setselectedUser(userData.data);
  }, [userData]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex my-3 w-[95%] bg-red-50">
        <AppCard className="w-[60%] flex justify-around h-[70px] items-center">
          {selectedUser && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <UserImage
                  name={selectedUser.user_name}
                  src={selectedUser.img}
                  width={30}
                  height={30}
                />
                <div className="ml-4">{selectedUser.user_name}</div>
              </div>
            </div>
          )}
        </AppCard>
        <AppCard className="w-[20%] mx-2">
          <div>k</div>
        </AppCard>
        <AppCard className="w-[20%]">
          <div>k</div>
        </AppCard>
      </div>
      <div className="flex flex-wrap justify-between w-[95%]">
        {!!reportList.length &&
          reportList.map(({ date, result, plan }, i) => (
            <ReportReviewCard
              key={"reportreviewlist-" + i}
              date={date}
              result={result}
              plan={plan}
            />
          ))}
      </div>
    </div>
  );
};

export default UserReportManagePage;
