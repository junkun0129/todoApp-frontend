import { Button, Image, message } from "antd";
import React, { useRef } from "react";
import { useAppSelector } from "../store/store";
import { useUpdateImgMutation } from "../api/userApi";

const EditProfilePage = () => {
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  const [updateImageMutation] = useUpdateImgMutation();
  const inputRef = useRef<HTMLInputElement>();
  const handleImageSave = (event) => {
    if (!event.target.files.length) return;
    const file = event.target.files[0];

    updateImageMutation(file).then((res: any) => {
      if (!res.error) {
        if (res.data.result === "success") {
          message.success("プロフィール画像の変更に成功しました");
        }
      }
    });
    inputRef.current.value = "";
  };
  const onInputClick = () => {
    inputRef.current.click();
  };
  return (
    <div>
      <div>profile image</div>
      <Image height={100} width={100} src={user?.img} />
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleImageSave}
      ></input>
      <Button onClick={onInputClick}>画像変更</Button>
      <div>username {user?.user_name}</div>
    </div>
  );
};

export default EditProfilePage;
