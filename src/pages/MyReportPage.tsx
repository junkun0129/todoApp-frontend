import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/store";
import { User } from "../type/user";
import { useGetReportsQuery } from "../api/reportApi";
import { useGetProfileQuery } from "../api/userApi";
import { DisplayPairedReport, PairedReport } from "../type/report";
import AppCard from "../component/card/AppCard";
import UserImage from "../component/imagecontainer/UserImage";
import ReportReviewCard from "../component/card/ReportReviewCard";
import { DatePicker, DatePickerProps, Select } from "antd";
import { generateDateKeysObject } from "../util/util";

const MyReportPage = () => {
  const user_id = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.user_id
  );
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const [selectedMonth, setselectedMonth] = useState<string>("");
  const { data, isSuccess } = useGetReportsQuery({
    category: "",
    date: "",
    year_month: selectedMonth,
  });
  const { data: userData, isSuccess: getUserIsSuccess } =
    useGetProfileQuery(user_id);
  const [reportList, setreportList] = useState<DisplayPairedReport>();
  useEffect(() => {
    if (!isSuccess) return;
    console.log(data);
    getDisplayPairedReportList(data.data);
  }, [data]);

  useEffect(() => {
    if (!getUserIsSuccess) return;
    setselectedUser(userData.data);
  }, [userData]);

  const getDisplayPairedReportList = (pairedReports: PairedReport[]) => {
    let displayObject: DisplayPairedReport =
      generateDateKeysObject(selectedMonth);
    console.log(displayObject);
    pairedReports.map((pairReport, i) => {
      displayObject[pairReport.date] = pairReport;
    });

    setreportList(displayObject);
  };

  const handleDateChange: DatePickerProps["onChange"] = (date, datestring) => {
    console.log(datestring);
    if (!Array.isArray(datestring)) {
      setselectedMonth(datestring);
    } else {
      setselectedMonth("");
    }
  };
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
                <DatePicker
                  picker={"month"}
                  type={"month"}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          )}
        </AppCard>
        <AppCard className="w-[20%] mx-2">
          <div>show something</div>
        </AppCard>
        <AppCard className="w-[20%]">
          <div>show something</div>
        </AppCard>
      </div>
      <div className="flex flex-wrap justify-between w-[95%] h-[70%] overflow-scroll z-50">
        {selectedMonth === "" ? (
          <div>日付を選択してください</div>
        ) : (
          !!reportList &&
          Object.entries(reportList).map(([dateKey, report]) => {
            return (
              <ReportReviewCard
                key={"reportreviewlist-" + dateKey}
                date={dateKey}
                result={report ? report.result : null}
                plan={report ? report.plan : null}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyReportPage;
