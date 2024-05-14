import "./App.css";
import "./tailwind.css";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Applayout from "./layout/Applayout";
import SignIn from "./pages/SignIn";
import ReportCreatePage from "./pages/ReportCreatePage";
import { appRoute } from "./constants/routes";
import { useAppDispatch } from "./store/store";
import { useEffect } from "react";
import { setScreenSize } from "./slice/appSlice";
import ReportManagePage from "./pages/ReportManagePage";
import TaskManagePage from "./pages/TaskManagePage";
import EditProfilePage from "./pages/EditProfilePage";
import Jikken from "./pages/Jikken";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // handle window resize
    const handleResize = () => {
      const screenSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };
      dispatch(setScreenSize(screenSize));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>

          <Route element={<Applayout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path={appRoute.reportCreate} element={<Jikken />}></Route>
            <Route
              path={appRoute.reportList}
              element={<ReportManagePage />}
            ></Route>
            <Route
              path={appRoute.reportList}
              element={<ReportManagePage />}
            ></Route>
            <Route
              path={appRoute.userEdit}
              element={<EditProfilePage />}
            ></Route>
            <Route path={appRoute.attendCreate} element={<Jikken />}></Route>
            <Route
              path={appRoute.taskManage}
              element={<TaskManagePage />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
