import { Calendar } from "antd";
import React, { useEffect, useState } from "react";
import { useGetReportsQuery } from "../api/reportApi";
import { Report, ReportList } from "../type/report";

const ReportManagePage = () => {
  const [selectedDate, setselectedDate] = useState<string>("");
  const { data, isSuccess, isLoading } = useGetReportsQuery({
    date: selectedDate,
  });
  const [dataSource, setdataSource] = useState<ReportList[]>([]);
  useEffect(() => {
    if (!isSuccess) return;
    console.log(data);
    setdataSource(data.data);
  }, [data]);
  return (
    <div className="flex w-full h-full ">
      <div className="w-[20%] bg-blue-200">
        <div className="w-full h-[50%]">
          {/* <Calendar
            className="w-full h-full"
            onSelect={(e) => console.log(e)}
          ></Calendar> */}
        </div>
        <div className="w-full h-[50%]">
          {dataSource.map((item, i) => {
            return (
              <div key={i}>
                {item.title} 作成日時：{item.created_at} 作成者{item.user_name}
              </div>
            );
          })}
        </div>
      </div>
      <div className=" w-[80%] bg-red-100">detail</div>
    </div>
  );
};

export default ReportManagePage;
