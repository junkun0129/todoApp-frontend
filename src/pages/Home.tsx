import ProtectedLayout from "../layout/ProtectedLayout";

import TodoManage from "../section/TodoManage";

const Home = () => {
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
