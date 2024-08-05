import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/store";
import { User } from "../type/user";
import { useGetReportsQuery } from "../api/reportApi";
import { useGetProfileQuery } from "../api/userApi";
import { PairedReportList } from "../type/report";
import AppCard from "../component/card/AppCard";
import UserImage from "../component/imagecontainer/UserImage";
import ReportReviewCard from "../component/card/ReportReviewCard";
import { DatePicker, Select } from "antd";

const MyReportPage = () => {
  const user_id = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.user_id
  );
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const { data, isSuccess } = useGetReportsQuery({ category: "", date: "" });
  const { data: userData, isSuccess: getUserIsSuccess } =
    useGetProfileQuery(user_id);
  const [reportList, setreportList] = useState<PairedReportList[]>([]);
  useEffect(() => {
    if (!isSuccess) return;
    setreportList(data.data);
    console.log(data.data);
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
                <DatePicker type={"month"} onChange={() => console.log("l")} />
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

export default MyReportPage;
