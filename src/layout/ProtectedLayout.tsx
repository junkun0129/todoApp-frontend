import { ReactNode, useEffect } from "react";
import { useAppSelector } from "../store/store";
import { useNavigate } from "react-router-dom";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAppSelector(
    (state) => state.persistedReducer.AuthReducer
  );
  const navigate = useNavigate();
  useEffect(() => {
    console.log(isAuth);
    if (!isAuth) {
      navigate("/signin");
    }
  }, [isAuth]);
  return children;
};

export default ProtectedLayout;
