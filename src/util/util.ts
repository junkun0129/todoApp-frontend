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

export const getUserColor = (name: string) => {
  const length = name.length;
  if (length < 5) {
    return "red";
  }
  switch (length) {
    case 6:
      return "blue";
    case 7:
      return "green";
    case 8:
      return "yellow";
    case 9:
      return "black";
    case 10:
      return "gray";
    case 11:
      return "skyblue";
    case 12:
      return "purple";
    default:
      return "green";
  }
};
