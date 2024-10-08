import React from "react";
import { ReportList } from "../../type/report";
import AppCard from "./AppCard";
import ReportCircle from "../datadisplay/ReportCircle";
import { Button } from "antd";
type Props = {
  date: string;
  result: ReportList | null;
  plan: ReportList | null;
};
const ReportReviewCard = ({ date, result, plan }: Props) => {
  const circleR = 100;
  const [year, month, day] = date.split("-");
  const formattedDate = `${year}年${month}月${day}日`;
  const workdedHour = result ? result.report.hours + "時間" : "--";
  const specialOccation = result ? result.report.status : "-";

  return (
    <AppCard className="w-[49.5%] mb-6">
      <div className="">
        <div className="flex">
          <div>{formattedDate}</div>
          <div
            style={{ fontSize: "0.6rem", background: "#F0F0F0" }}
            className="flex rounded items-center justify-around px-2 ml-5"
          >
            <div>就労時間:{workdedHour}</div>
            <div>特別状態:{specialOccation}</div>
            <div>予定進行率:{21}%</div>
          </div>
        </div>
        <div className=" flex justify-around items-center mt-6 ml-10 overscroll-auto">
          <div>
            {plan ? (
              <ReportCircle
                radius={circleR}
                dailyTasks={plan.dailytasks}
                maxHours={plan.report.hours}
              />
            ) : (
              <div>
                <CreateReportButton />
              </div>
            )}
          </div>
          <div>
            {result ? (
              <ReportCircle
                radius={circleR}
                dailyTasks={result.dailytasks}
                maxHours={result.report.hours}
              />
            ) : (
              <div>
                <CreateReportButton />
              </div>
            )}
          </div>
        </div>
      </div>
      <div></div>
    </AppCard>
  );
};

const CreateReportButton = () => {
  return <Button>日報作成</Button>;
};

export default ReportReviewCard;
