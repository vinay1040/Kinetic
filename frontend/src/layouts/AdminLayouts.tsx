import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Typography, Button } from "antd";

import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Package } from "lucide-react";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: "Products",
    },
    {
      key: "/admin/inventry",
      icon: <Package size={16} />,
      label: "Inventry",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="flex min-h-screen flex-col">
          <div className="flex h-16 items-center justify-center">
            <Typography.Title level={4} className="!mb-0 !text-white">
              KINETIC
            </Typography.Title>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />

          <div className="mt-auto p-4">
            <Button
              type="text"
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="!text-red-300 !font-semibold !border-red-300 !border-2"
            >
              Logout
            </Button>
          </div>
        </div>
      </Sider>

      {/* Right Side */}
      <Layout>
        {/* Header */}
        <Header className="flex items-center justify-between bg-white px-6">
          <Typography.Title level={4} className="!mb-0">
            Admin Panel
          </Typography.Title>
        </Header>

        {/* Content */}
        <Content className="mx-4 mt-6">
          <div className="min-h-[360px] rounded-lg bg-white p-6">
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer className="text-center">
          ShopNest Admin Panel ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
