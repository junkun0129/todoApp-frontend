import { DisplayPairedReport } from "../type/report";

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

export function getCurrentMonth() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() は 0-11 の範囲なので +1 する
  return `${year}-${month}`;
}

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
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

export function findCircleSliceIndex(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number,
  radius: number,
  slices: number
) {
  // 与えられた座標が円の中心となるように平行移動します
  const translatedPointX = pointX - centerX;
  const translatedPointY = pointY - centerY;

  // 与えられた座標の距離を計算します
  const distanceSquared = translatedPointX ** 2 + translatedPointY ** 2;

  // 与えられた座標が円の外にある場合は false を返します
  if (distanceSquared > radius ** 2) {
    return null;
  }

  // 与えられた座標の角度を計算します
  let angle =
    Math.atan2(translatedPointY, translatedPointX) * (180 / Math.PI) + 90;
  if (angle < 0) {
    angle += 360; // 角度を正規化します
  }

  // 与えられた座標が円をX等分したときの何スライス目にあるかを計算します
  const sliceSize = 360 / slices;
  const sliceIndex = Math.floor(angle / sliceSize);

  return sliceIndex;
}

export function getDaysInMonth(yearMonth: string) {
  // 年と月を抽出
  const [year, month] = yearMonth.split("-").map(Number);

  // 翌月の最初の日を取得し、日数を計算
  const nextMonth = new Date(year, month, 1);
  const daysInMonth = new Date(nextMonth.getTime() - 86400000).getDate();
  return daysInMonth;
}

export function generateDateKeysObject(yearMonth: string): DisplayPairedReport {
  // 年と月を抽出
  const [year, month] = yearMonth.split("-").map(Number);

  // 翌月の最初の日を取得し、日数を計算
  const nextMonth = new Date(year, month, 1);
  const daysInMonth = new Date(nextMonth.getTime() - 86400000).getDate();

  // 結果を格納するオブジェクト
  const dateKeysObject = {};

  // 1日からその月の日数までループし、キーを作成
  for (let day = 1; day <= daysInMonth; day++) {
    // 日付を2桁の文字列にする
    const dayStr = String(day).padStart(2, "0");
    // 年月日形式のキーを作成
    const key = `${yearMonth}-${dayStr}`;
    // オブジェクトにキーを追加し、値はnullに設定
    dateKeysObject[key] = null;
  }
  return dateKeysObject;
}
