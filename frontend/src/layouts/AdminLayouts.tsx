import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import { Avatar, Button, Layout, Typography } from "antd";
import type { MenuProps } from "antd";

import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems: MenuProps["items"] = [
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
      icon: <InboxOutlined />,
      label: "Inventory",
    },
    {
      key: "/admin/analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Customers",
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
    <Layout className="min-h-screen !bg-[#f5f7fc]">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto">
        <Sider
          width={230}
          breakpoint="lg"
          collapsedWidth={0}
          theme="light"
          className="!bg-white !border-r !border-slate-200 !h-screen"
        >
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShoppingCartOutlined className="text-xl" />
            </div>

            <div>
              <Typography.Title level={4} className="!mb-0 !text-slate-900">
                KINETIC
              </Typography.Title>
              <span className="text-xs text-slate-400">ADMIN PANEL</span>
            </div>
          </div>

          <div className="px-2 py-1 ">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                if (!item || item.key == null) return null;
                if (!("icon" in item)) return null;

                const itemKey = String(item.key);
                const isActive = location.pathname === itemKey;

                return (
                  <button
                    key={itemKey}
                    onClick={() => navigate(itemKey)}
                    className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className=" bottom-0 w-full border-t border-slate-100 px-2 py-3">
            <Button
              type="text"
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="!h-11 !justify-start !font-medium"
            >
              Logout
            </Button>
          </div>
        </Sider>
      </aside>

      <Layout className="!bg-[#f5f7fc] !ml-57">
        <Header className="!h-[54px] !bg-white !px-5 md:!px-8 !border-b !border-slate-200 flex items-center justify-between">
          <div>
            <Typography.Text className="!text-sm !text-slate-500">
              Kinetic / Administration
            </Typography.Text>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block border-r-1 px-2 border-slate-400">
              <p className="text-sm font-semibold text-slate-800">
                Administrator
              </p>
              <p className="text-xs text-slate-400">Store Management</p>
            </div>

            <Avatar
              size={40}
              icon={<UserOutlined />}
              className="!bg-blue-100 !text-blue-600"
            />
          </div>
        </Header>

        <Content className="min-h-[calc(100vh-140px)] p-4 md:p-8">
          <Outlet />
        </Content>

        <Footer className="!bg-transparent !text-center !text-xs !text-slate-400">
          Kinetic Admin Panel © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
