import {
  Button,
  Form,
  Input,
  Modal,
  ModalProps,
  Image,
  Divider,
  Space,
  message,
} from "antd";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../../type/api/user";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../api/userApi";
import { setUser } from "../../slice/userSlice";
import { useUpdateProfImageMutation } from "../../api/fileApi";
type Props = {
  ModalProps: ModalProps;
  onClose: () => void;
};
const ProfileEditModal = ({ ModalProps, onClose }: Props) => {
  const [updateProfileMutation, {}] = useUpdateProfileMutation();
  const [updateImageMutation] = useUpdateProfImageMutation();
  const dispatch = useAppDispatch();
  const { email, lastName, firstName, img } = useAppSelector(
    (state) => state.persistedReducer.userReducer.user
  );
  const getUser = useGetProfileQuery(email);
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    if (getUser.isSuccess) {
      const user = getUser.data.data;
      dispatch(
        setUser({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          img: user.profile_image_url,
        })
      );
    }
  }, [getUser.data]);

  useEffect(() => {
    form.setFieldsValue({
      lastName: lastName,
      firstName: firstName,
      email: email,
    });
  }, []);
  const [form] = Form.useForm();
  const handleSave = async (values) => {
    const request: UpdateProfileRequest = {
      body: {
        email,
        firstName: values.firstName,
        lastName: values.lastName,
      },
    };
    updateProfileMutation(request).then((res: any) => {
      if (res.err) {
        message.error("プロフィールの変更に失敗しました");
      } else {
        const response = res.data as UpdateProfileResponse;
        if (response.result === "success") {
          message.success("プロフィールの変更に成功しました");
        } else {
          message.error("プロフィールの変更に失敗しました");
        }
      }
      getUser.refetch();
      onClose();
    });
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const onInputClick = () => {
    inputRef.current.click();
  };

  const handleImageSave = (event) => {
    if (!event.target.files.length) return;
    const file = event.target.files[0];

    updateImageMutation(file).then((res: any) => {
      console.log(res);
    });
    inputRef.current.value = "";
  };
  return (
    <div>
      <Modal
        {...ModalProps}
        title={"プロフィール編集"}
        onCancel={handleCancel}
        footer={<></>}
      >
        <Space
          style={{
            display: "flex",
          }}
        >
          <Space style={{ display: "flex", flexDirection: "column" }}>
            <Image src={img}></Image>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              ref={inputRef}
              style={{ display: "none" }}
              onChange={handleImageSave}
            ></input>
            <Button onClick={onInputClick}>画像変更</Button>
          </Space>
          <Divider
            style={{ height: "200px", marginLeft: "30px", marginRight: "30px" }}
            type="vertical"
          ></Divider>
          <Form form={form} onFinish={handleSave}>
            <Form.Item name={"lastName"} label={"姓"}>
              <Input defaultValue={lastName} />
            </Form.Item>
            <Form.Item name={"firstName"} label={"名"}>
              <Input defaultValue={firstName} />
            </Form.Item>
            <Button htmlType="submit">保存</Button>
          </Form>
        </Space>
      </Modal>
    </div>
  );
};

export default ProfileEditModal;
