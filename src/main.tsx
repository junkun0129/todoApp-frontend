import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./tailwind.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import { themeColor } from "./constants/style.const.ts";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "rgb(143, 116, 57)",
                colorPrimaryHover: "rgb(176, 149, 102)",
                colorPrimaryActive: "rgb(178, 158, 82)",
              },
              Menu: {
                itemBg: themeColor.layoutBg,
                itemColor: "rgba(255, 255, 255, 0.88)",
                itemSelectedColor: "rgb(255, 255, 255)",
                itemSelectedBg: "rgb(95, 172, 95)",
                itemActiveBg: "rgb(82, 196, 26)",
                itemHoverColor: "rgba(255, 255, 255, 0.88)",
                groupTitleColor: "rgba(255, 255, 255, 0.53)",
              },
              Layout: {
                headerBg: "rgb(53, 125, 17)",
              },
            },
          }}
        >
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </>
);
