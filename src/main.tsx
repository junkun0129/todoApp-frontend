import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
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
            },
          }}
        >
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </>
);
