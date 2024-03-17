import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [dataSource, setdataSource] = useState<any[]>();
  useEffect(() => {
    fetch("https://todoapp-backend-0fle.onrender.com/test/list")
      .then((res: any) => {
        if (!res.ok) {
          throw new Error("network is not ok");
        }
        return res.json();
      })
      .then((data: any[]) => {
        console.log(data);
        setdataSource(data);
      });
  }, []);
  useEffect(() => {}, [dataSource]);
  return (
    <>
      {dataSource ? (
        <>
          {dataSource.map((item, i) => {
            return (
              <div key={i}>
                <div>id : {item.id}</div>
                <div>email : {item.email}</div>
                <div>username : {item.username}</div>
                <div>ege : {item.age}</div>s
              </div>
            );
          })}
        </>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
}

export default App;
