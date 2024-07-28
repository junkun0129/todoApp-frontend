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
