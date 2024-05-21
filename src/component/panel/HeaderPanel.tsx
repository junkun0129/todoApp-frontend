import React from "react";
import UserImage from "../imagecontainer/UserImage";
import { User } from "../../type/user";

const HeaderPanel = ({ user }: { user: User }) => {
  return (
    <div
      style={{ backgroundColor: "rgba(255, 255, 255, 0.68)" }}
      className="  h-[70%] bg-red-50 rounded flex justify-between items-center"
    >
      <UserImage
        className="ml-5"
        name={user.user_name}
        src={user.img}
        width={30}
        height={30}
      ></UserImage>
      <div className="mx-6">{user.user_name}</div>
      <div className="mr-5">⚙</div>
    </div>
  );
};

export default HeaderPanel;
