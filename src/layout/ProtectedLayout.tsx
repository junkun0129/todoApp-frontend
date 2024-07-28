import { ReactNode, useEffect } from "react";
import { useAppSelector } from "../store/store";
import { useNavigate } from "react-router-dom";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  return children;
};

export default ProtectedLayout;
