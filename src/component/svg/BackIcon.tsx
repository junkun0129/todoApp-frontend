import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { appRoute } from "../../constants/routes";

const BackIcon = () => {
  const duration = 2000;
  const [pathData, setPathData] = useState(
    "M718.11 -123.417C1007.95 16.3082 1029.91 144.155 404.156 449.778C366.495 520.45 327.212 527.186 246.646 650.728C178.281 646.118 -32.4184 749.129 5.24301 678.457C42.9044 607.784 639.883 -165.105 718.11 -123.417Z"
  );
  const location = useLocation();
  useEffect(() => {
    const newPathData =
      "M500 -150C900 50 1000 200 300 400C260 500 220 520 150 650C80 650 -50 700 10 650C60 600 600 -150 500 -150Z";
    const defaultPathData =
      "M718.11 -123.417C1007.95 16.3082 1029.91 144.155 404.156 449.778C366.495 520.45 327.212 527.186 246.646 650.728C178.281 646.118 -32.4184 749.129 5.24301 678.457C42.9044 607.784 639.883 -165.105 718.11 -123.417Z";
    const taskPathData =
      "M977.906 464.499C915.282 780.109 797.018 833.404 344.32 304.223C266.464 285.476 250.098 249.135 110.307 202.103C97.6359 134.765 -54.8942 -43.3927 22.9618 -24.6456C100.818 -5.89857 998.657 378.321 977.906 464.499Z";
    console.log(location);
    switch (location.pathname) {
      case appRoute.taskManage:
        setPathData(taskPathData);
        break;
      default:
        setPathData(defaultPathData);
        break;
    }
    // アニメーションのためにpathデータを変更する

    // コンポーネントがアンマウントされるときにタイマーをクリアする
  }, [location]);

  return (
    <svg
      width="914"
      height="551"
      viewBox="0 0 914 551"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathData}
        fill="#D2E1CA"
        className="animated-path" // CSSクラスを追加
        style={{ transition: "d 1s ease-in-out" }}
      />
    </svg>
  );
};

export default BackIcon;
