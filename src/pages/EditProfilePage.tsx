import { Image } from "antd";
import React from "react";
import { useAppSelector } from "../store/store";

const EditProfilePage = () => {
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  return (
    <div>
      <div>profile image</div>
      <Image height={100} width={100} src={user?.img} />
        
      <div>username {user?.user_name}</div>
    </div>
  );
};

export default EditProfilePage;
