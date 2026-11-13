import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router";

const menuItems = [
  {
    path: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    end: true,
  },
  {
    path: "/admin/orders",
    icon: <ShoppingCartOutlined />,
    label: "Orders",
  },
  {
    path: "/admin/products",
    icon: <ShoppingOutlined />,
    label: "Products",
  },
  {
    path: "/admin/inventry",
    icon: <InboxOutlined />,
    label: "Inventory",
  },
  {
    path: "/admin/analytics",
    icon: <BarChartOutlined />,
    label: "Analytics",
  },
  {
    path: "/admin/users",
    icon: <UserOutlined />,
    label: "Customers",
  },
  {
    path: "/admin/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];
type AdminSiderProp = {
  onNavigate: () => void;
};
export const AdminSiderBar = ({ onNavigate }: AdminSiderProp) => {
  return (
    <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#004AC6] text-white"
                    : "text-[#52617A] hover:bg-[#DCE8FF] hover:text-[#004AC6]"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
