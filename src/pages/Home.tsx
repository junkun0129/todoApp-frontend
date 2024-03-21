import { useEffect } from "react";
import ProtectedLayout from "../layout/ProtectedLayout";

import TodoManage from "../section/TodoManage";
import { useAppSelector } from "../store/store";

const Home = () => {
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <ProtectedLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          height: "100%",
        }}
      >
        <TodoManage></TodoManage>
      </div>
    </ProtectedLayout>
  );
};

export default Home;
