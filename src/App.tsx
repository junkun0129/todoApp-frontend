import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [dataSource, setdataSource] = useState<any[]>();
  useEffect(() => {
    fetch("http://localhost:3000/test/list")
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
  useEffect(() => {
    console.log(
      dataSource.map((item, i) => {
        return item.age;
      })
    );
  }, [dataSource]);
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
