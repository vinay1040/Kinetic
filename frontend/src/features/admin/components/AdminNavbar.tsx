import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";

const routeTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/inventry": "Inventory",
  "/admin/analytics": "Analytics",
  "/admin/users": "Customers",
  "/admin/settings": "Settings",
};

type AdminNavProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileDrawer: () => void;
};

export const AdminNavbar = ({
  collapsed,
  onToggleCollapse,
  onOpenMobileDrawer,
}: AdminNavProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTitle =
    Object.entries(routeTitles)
      .sort(([a], [b]) => b.length - a.length)
      .find(([path]) =>
        path === "/admin"
          ? location.pathname === "/admin"
          : location.pathname.startsWith(path),
      )?.[1] ?? "Admin Dashboard";

  const profileMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/admin/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <header className="z-30 flex h-14 items-center justify-between border-b border-[#E5ECF8] bg-white px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onOpenMobileDrawer}
          className="lg:!hidden"
          aria-label="Open menu"
        />

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="!hidden lg:!inline-flex"
          aria-label="Toggle sidebar"
        />

        <h1 className="truncate text-base font-semibold text-[#17233C] sm:text-lg">
          {currentTitle}
        </h1>
      </div>

      <Dropdown
        menu={{ items: profileMenuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#F1F5FD]"
        >
          <Avatar size="small" className="!bg-[#004AC6] sm:!size-8">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium leading-tight text-[#17233C]">
              {user?.name || "Administrator"}
            </p>
            <p className="text-xs leading-tight text-[#52617A]">Admin</p>
          </div>
        </button>
      </Dropdown>
    </header>
  );
};
