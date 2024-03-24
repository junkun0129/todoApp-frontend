import { useEffect } from "react";
import ProtectedLayout from "../layout/ProtectedLayout";

import TodoManage from "../section/TodoManage";
import { useAppSelector } from "../store/store";
import TaskDetail from "../section/TaskDetail";

const Home = () => {
  const { user } = useAppSelector(
    (state) => state.persistedReducer.userReducer
  );
  const { selectedGroupkey } = useAppSelector((state) => state.selectReducer);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <ProtectedLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <TodoManage></TodoManage>
        {selectedGroupkey && <TaskDetail />}
      </div>
    </ProtectedLayout>
  );
};

export default Home;
