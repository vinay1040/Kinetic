import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  InboxOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Tooltip } from "antd";
import { NavLink } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";
import { LogOut } from "lucide-react";

const menuItems = [
  { path: "/admin", icon: <DashboardOutlined />, label: "Dashboard", end: true },
  { path: "/admin/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { path: "/admin/products", icon: <ShoppingOutlined />, label: "Products" },
  { path: "/admin/inventry", icon: <InboxOutlined />, label: "Inventory" },
  { path: "/admin/analytics", icon: <BarChartOutlined />, label: "Analytics" },
  { path: "/admin/users", icon: <UserOutlined />, label: "Customers" },
  { path: "/admin/settings", icon: <SettingOutlined />, label: "Settings" },
];

type AdminSideBarProps = {
  collapsed?: boolean;
  isMobile?: boolean;
  onNavigate?: () => void;
};

export const AdminSideBar = ({
  collapsed = false,
  isMobile = false,
  onNavigate,
}: AdminSideBarProps) => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white select-none">
      <div
        className={`flex h-16 shrink-0 items-center border-b border-[#E5ECF8] px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#004AC6] text-white">
            <ShoppingCartOutlined className="text-lg" />
          </div>
          {!collapsed && (
            <span className="truncate text-xl font-bold text-[#004AC6]">
              Kinetic
            </span>
          )}
        </div>

        {isMobile && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onNavigate}
            aria-label="Close navigation"
          />
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const link = (
              <NavLink
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    collapsed ? "justify-center px-2" : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-[#004AC6] text-white"
                      : "text-[#52617A] hover:bg-[#DCE8FF] hover:text-[#004AC6]"
                  }`
                }
              >
                <span className="text-base leading-none">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );

            return (
              <li key={item.path}>
                {collapsed ? (
                  <Tooltip title={item.label} placement="right">
                    {link}
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-[#E5ECF8] p-2.5">
        <Popconfirm
          title="Logout"
          description="Are you sure you want to logout?"
          onConfirm={handleLogout}
          okText="Yes"
          cancelText="No"
          placement={collapsed ? "rightBottom" : "top"}
        >
          <Button
            danger
            type="text"
            block
            icon={<LogOut />}
            className={collapsed ? "!px-0" : "!justify-start"}
          >
            {!collapsed && "Logout"}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};