import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "antd/dist/antd.css";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { ConfigProvider } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import Page from "./Page";

const queryClient = new QueryClient();

export default function App() {
  return (
    <AntdConfigProvider>
      <ConfigProvider locale={zhCN}>
        <QueryClientProvider client={queryClient}>
          <Page />
        </QueryClientProvider>
      </ConfigProvider>
    </AntdConfigProvider>
  );
}
