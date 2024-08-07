import {
  DatePicker,
  DatePickerProps,
  Segmented,
  SegmentedProps,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { ReportInfo } from "../../pages/ReportCreate";
import { useGetReportMutation } from "../../api/reportApi";
type Props = {
  reportInfo: ReportInfo;
  setRePortInfo: (info: ReportInfo) => void;
  setIsReportEdible: (edible: boolean) => void;
  isDateSelected: boolean;
  setIsDateSelected: (isSelected: boolean) => void;
};
const CreateReportHeader = ({
  reportInfo,
  setRePortInfo,
  setIsReportEdible,
  isDateSelected,
  setIsDateSelected,
}: Props) => {
  const { genre, maxhour, status, date } = reportInfo;
  const handleWorkHour = (value: number) => {
    const newReportInfo: ReportInfo = { ...reportInfo, maxhour: value };
    setRePortInfo(newReportInfo);
  };
  const [getReport] = useGetReportMutation();
  const handleReportStatus = (value) => {
    const newReportInfo: ReportInfo = { ...reportInfo, status: value };
    setRePortInfo(newReportInfo);
  };

  const handleDateChange: DatePickerProps["onChange"] = (date, datestring) => {
    if (!Array.isArray(datestring)) {
      const newReportInfo: ReportInfo = { ...reportInfo, date: datestring };
      setRePortInfo(newReportInfo);
      setIsDateSelected(!!datestring);
    }
  };

  const handleGenreChange: SegmentedProps["onChange"] = (value) => {
    const newReportInfo: ReportInfo = { ...reportInfo, genre: value as string };
    setRePortInfo(newReportInfo);
  };

  useEffect(() => {
    checkIsEdible();
  }, [reportInfo.date, reportInfo.genre]);

  const checkIsEdible = async () => {
    const res: any = await getReport({
      category: reportInfo.genre,
      date: reportInfo.date ?? "",
    });
    setIsReportEdible(!!!res.data.data.length);
  };

  return (
    <div className="flex w-full justify-between mt-5" style={{}}>
      <div className="ml-8" style={{ fontSize: "2rem", width: "200px" }}>
        日報作成
      </div>
      <div className="flex w-full justify-around">
        <div className="flex items-center">
          <div>日時:</div>
          <DatePicker onChange={handleDateChange} />
        </div>
        <div className="flex items-center">
          <Segmented
            disabled={!isDateSelected}
            onChange={handleGenreChange}
            options={[
              { value: "plan", label: "計画" },
              { value: "result", label: "実績" },
            ]}
          />
        </div>
        <div className="flex items-center">
          <div>就業時間:</div>
          <Select
            disabled={!isDateSelected}
            options={[
              { value: 4, label: "4時間" },
              { value: 8, label: "8時間" },
            ]}
            value={maxhour}
            onChange={handleWorkHour}
          />
        </div>
        <div className="flex items-center">
          <div>特別状態:</div>
          <Select
            disabled={!isDateSelected}
            className="w-[100px]"
            options={[
              { value: "rest", label: "公欠" },
              { value: "leave-early", label: "早退" },
              { value: "late", label: "遅刻" },
            ]}
            value={status}
            onChange={handleReportStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateReportHeader;
