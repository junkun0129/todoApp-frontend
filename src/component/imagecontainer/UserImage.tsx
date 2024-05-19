import React, { useState } from "react";
import { User } from "../../type/user";
import { getUserColor } from "../../util/util";

const UserImage = ({
  name,
  src,
  width,
  height,
}: {
  name: string;
  src: string;
  width: number;
  height: number;
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const fallbackColor = getUserColor(name);

  return hasError ? (
    <div
      className="flex justify-center items-center"
      style={{
        width,
        height,
        borderRadius: 50,
        backgroundColor: fallbackColor,
        color: "white",
      }}
    >
      {name[0]}
    </div>
  ) : (
    <img src={src} onError={handleError} />
  );
};

export default UserImage;
