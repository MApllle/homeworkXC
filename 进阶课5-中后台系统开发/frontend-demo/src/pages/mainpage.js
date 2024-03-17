import React from "react";
import Task from "./task/index";
import Admin from "./admin/admin";
import Topbar from "./topbar";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const sideritem = [
  {
    key: "/task",
    icon: React.createElement(LaptopOutlined),
    label: "任务管理",
  },
  {
    key: "/admin",
    icon: React.createElement(UserOutlined),
    label: "权限管理",
  },
];
const MainpageApp = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [current, setCurrent] = React.useState("/task");

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Topbar />
      </Header>
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>主页面</Breadcrumb.Item>
          <Breadcrumb.Item>
            {current === "/admin" ? "用户管理" : "任务管理"}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["/task"]}
              onClick={(e) => setCurrent(e.key)}
              style={{
                height: "100%",
              }}
              items={sideritem}
            />
          </Sider>
          <Content
            style={{
              padding: "0 24px",
              minHeight: 800,
            }}
          >
            {current === "/admin" ? <Admin /> : <Task />}
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      ></Footer>
    </Layout>
  );
};
export default MainpageApp;
