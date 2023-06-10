import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { ConfigProvider } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import React from "react";

console.log("process: ", process);
console.log("process.env: ", process.env);
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

const Page = React.lazy(() => import("./Page"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <AntdConfigProvider>
      <ConfigProvider locale={zhCN}>
        <QueryClientProvider client={queryClient}>
          <React.Suspense fallback={<div></div>}>
            <Page />
          </React.Suspense>
        </QueryClientProvider>
      </ConfigProvider>
    </AntdConfigProvider>
  );
}
