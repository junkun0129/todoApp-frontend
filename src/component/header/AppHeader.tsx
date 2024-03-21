import { Button, Dropdown, MenuProps, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setLogout } from "../../slice/authSlice";
import Logo from "../svg/Logo";
import { CSSProperties, useEffect, useState } from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import ProfileEditModal from "../modal/ProfileEditModal";
const AppHeader = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );

  useEffect(() => {
    console.log(user);
  }, [user]);

  const [isEditModaOpen, setisEditModaOpen] = useState<boolean>(false);
  const handleLogout = () => {
    dispatch(setLogout());
  };
  const onEditModalClose = () => {
    setisEditModaOpen(false);
  };
  const items: MenuProps["items"] = [
    {
      label: "プロフィール編集",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => setisEditModaOpen(true),
    },
    {
      label: "ログアウト",
      key: "2",
      icon: <UserOutlined />,
      onClick: () => handleLogout(),
    },
  ];
  return (
    <Header style={HeaderStyle}>
      <div style={HeaderContentStyle}>
        <div style={LogoStyle}>
          <Logo styles={{ marginTop: "25px" }}></Logo>
          <h2 style={{ marginLeft: "10px" }}>TodoApp</h2>
        </div>
        <img style={ImgStyle} width={40} height={40} src={user.img} />
        <div>name : {`${user.lastName} ${user.firstName}`}</div>
        <div>email : {user.email}</div>
        <Dropdown trigger={["click"]} menu={{ items }}>
          <Button>
            <Space>
              設定
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <ProfileEditModal
          onClose={onEditModalClose}
          ModalProps={{
            open: isEditModaOpen,
          }}
        />
      </div>
    </Header>
  );
};

export default AppHeader;
const HeaderStyle = {
  backgroundColor: "#C3EABA",
  display: "flex",
  justifyContent: "center",
  width: "100vw",
};
const HeaderContentStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const LogoStyle = {
  display: "flex",
  alignItems: "center",
  height: "50px",
  marginLeft: "-20px",
};

const ImgStyle: CSSProperties = {
  objectFit: "contain",
  borderRadius: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
};
