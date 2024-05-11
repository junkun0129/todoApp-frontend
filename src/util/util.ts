export const getTmQuery = () => {
  return "?tm=" + new Date().getTime() + Math.floor(Math.random() * 1000000);
};
export const getReportTimestamp = () => {
  const date = new Date();

  // 年、月、日の取得
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるため+1する
  const day = date.getDate().toString().padStart(2, "0");

  // 年月日を連結して文字列にする
  const formattedDate = year + month + day;

  return formattedDate;
};
