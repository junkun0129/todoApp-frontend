import { Button, DatePicker, DatePickerProps, Select, TimePicker } from "antd";
import React, { useMemo, useState } from "react";
import { getCurrentMonth, getDaysInMonth } from "../util/util";
import dayjs from "dayjs";
type CollType =
  | "日付"
  | "開始時間"
  | "終了時間"
  | "休憩時間"
  | "実働就業時間"
  | "特別就業形態";

const AttendManage = () => {
  const headers = [
    { key: "date", label: "日付" },
    { key: "startTime", label: "開始時間" },
    { key: "endTime", label: "終了時間" },
    { key: "breakTime", label: "休憩時間" },
    { key: "workTime", label: "実働就業時間" },
    { key: "specialStatus", label: "特別就業形態" },
  ];

  const [selectedMonth, setselectedMonth] = useState<string>(getCurrentMonth());

  const daysInMonth = useMemo(() => {
    const days = getDaysInMonth(selectedMonth);
    return days;
  }, [selectedMonth]);

  const [tableData, setTableData] = useState(
    Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${selectedMonth}-${i + 1}`,
      startTime: "",
      endTime: "",
      breakTime: "",
      workTime: "",
      specialStatus: "",
    }))
  );

  console.log([...Array(daysInMonth)]);

  const handleMonthChange: DatePickerProps["onChange"] = (date, datestring) => {
    if (!Array.isArray(datestring)) {
      setselectedMonth(datestring);
    } else {
      setselectedMonth("");
    }
  };

  const CustomCell = ({
    colKey,
    displayDate,
    dayIndex,
  }: {
    colKey: string;
    displayDate: string;
    dayIndex: number;
  }) => {
    switch (colKey) {
      case "date":
        return displayDate;
      case "startTime":
        return (
          <TimePicker
            value={dayjs(tableData[dayIndex]["startTime"], "HH:mm:ss")}
            onChange={(time, timeString) =>
              handleCellChange(dayIndex, "startTime", timeString)
            }
            className="w-full"
          />
        );
      case "endTime":
        return (
          <TimePicker
            value={dayjs(tableData[dayIndex]["endTime"], "HH:mm:ss")}
            onChange={(time, timeString) =>
              handleCellChange(dayIndex, "endTime", timeString)
            }
            className="w-full"
          />
        );
      case "specialStatus":
        return (
          <Select
            className="w-full"
            value={tableData[dayIndex].specialStatus}
            options={[
              { value: "rest", label: "公欠" },
              { value: "leave-early", label: "早退" },
              { value: "late", label: "遅刻" },
            ]}
            onChange={(value) =>
              handleCellChange(dayIndex, "specialStatus", value)
            }
          />
        );
      default:
        return <input className="w-full" />;
    }
  };

  const handleCellChange = (dayIndex: number, colKey: string, value: any) => {
    const updatedTableData = [...tableData];
    updatedTableData[dayIndex][colKey] = value;
    setTableData(updatedTableData);
  };

  return (
    <div className="z-50">
      <div>
        <DatePicker picker="month" type="month" onChange={handleMonthChange} />
        <Button onClick={() => console.log(tableData)}>セーブ</Button>
      </div>
      <div>
        {selectedMonth === "" ? (
          <div>月を選択してください</div>
        ) : (
          <table>
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <td>{header.label}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(daysInMonth)].map((dayNum, i) => (
                <tr>
                  {headers.map((header, j) => (
                    <td>
                      <CustomCell
                        dayIndex={i}
                        colKey={header.key}
                        displayDate={`${selectedMonth.split("-")[1]}/${i + 1}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr></tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendManage;
