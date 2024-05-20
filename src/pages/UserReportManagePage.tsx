import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppCard from "../component/card/AppCard";
import { useGetReportsQuery } from "../api/reportApi";
import { GetReportRes, PairedReportList } from "../type/report";
import { ReportList } from "../type/report";

const UserReportManagePage = () => {
  const { userId } = useParams();
  const { data, isSuccess } = useGetReportsQuery({ user_id: userId });
  const [reportList, setreportList] = useState<PairedReportList[]>([]);
  useEffect(() => {
    if (!isSuccess) return;
    console.log(data.data);
    setreportList(data.data);
  }, [data]);
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <AppCard>
          <div>k</div>
        </AppCard>
        <AppCard>
          <div>k</div>
        </AppCard>
        <AppCard>
          <div>k</div>
        </AppCard>
      </div>
      <div className="flex flex-wrap justify-between w-[95%]">
        {!!reportList.length &&
          reportList.map(({ date, result, plan }, i) => {
            const [year, month, day] = date.split("-");
            const formattedDate = `${year}年${month}月${day}日`;
            return (
              <AppCard className="w-[47%] mb-6" key={"report-" + i}>
                <div className="flex">
                  <div>{formattedDate}</div>
                  <div
                    style={{ fontSize: "0.6rem" }}
                    className="flex rounded bg-gray-300 items-center justify-around px-2"
                  >
                    {/* <div>就労時間:{report.hours}時間</div>
                    <div>特別状態:{report.status || "なし"}</div>
                    <div>予定進行率:{21}%</div> */}
                  </div>
                  <div></div>
                </div>
                <div></div>
              </AppCard>
            );
          })}
      </div>
    </div>
  );
};

export default UserReportManagePage;
