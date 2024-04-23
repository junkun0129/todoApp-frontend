import { Calendar } from "antd";
import React from "react";

const ReportManagePage = () => {
  return (
    <div>
      <Calendar onSelect={(e) => console.log(e)}></Calendar>
    </div>
  );
};

export default ReportManagePage;
