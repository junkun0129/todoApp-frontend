import { Button } from "antd";
import { Header } from "antd/es/layout/layout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setLogout } from "../../slice/authSlice";
import Logo from "../svg/Logo";

const AppHeader = () => {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.userReducer);
  const handleLogout = () => {
    dispatch(setLogout());
  };
  return (
    <Header
      style={{
        backgroundColor: "#C3EABA",
        display: "flex",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "50px",
            marginLeft: "-20px",
          }}
        >
          <Logo styles={{ marginTop: "25px" }}></Logo>
          <h2 style={{ marginLeft: "10px" }}>TodoApp</h2>
        </div>
        <div>ユーザー：{email}</div>
        <Button onClick={handleLogout}>ログアウト</Button>
      </div>
    </Header>
  );
};

export default AppHeader;
