import React from "react";
import type { Dayjs } from "dayjs";
import { Calendar } from "antd";
import type { CalendarProps } from "antd";

const AppCalendar: React.FC = () => {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  return <Calendar style={{ width: "100%" }} onPanelChange={onPanelChange} />;
};

export default AppCalendar;
