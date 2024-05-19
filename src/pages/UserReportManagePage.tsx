import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppCard from "../component/card/AppCard";
import { useGetReportsQuery } from "../api/reportApi";
import { GetReportRes } from "../type/report";
import { ReportList } from "../type/report";

const UserReportManagePage = () => {
  const { userId } = useParams();
  const { data, isSuccess } = useGetReportsQuery({ user_id: userId });
  const [reportList, setreportList] = useState<ReportList[]>([]);
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
          reportList.map((report, i) => (
            <AppCard className="w-[47%] mb-6" key={"report-" + i}>
              <div>
                <div>{report.report.date}</div>
                <div></div>
                <div>:</div>
              </div>
              <div>ksk</div>
            </AppCard>
          ))}
      </div>
    </div>
  );
};

export default UserReportManagePage;
