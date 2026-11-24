import { NavLink } from "react-router";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  CircleUser,
} from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { Popconfirm } from "antd";

type AccountSidebarProps = {
  onNavigate?: () => void;
};

const accountMenuItems = [
  {
    label: "Overview",
    path: "/profile",
    icon: User,
    end: true,
  },
  {
    label: "Orders",
    path: "/profile/orders",
    icon: ShoppingBag,
    end: false,
  },
  {
    label: "Wishlist",
    path: "/wishlist",
    icon: Heart,
    end: true,
  },
  {
    label: "Settings",
    path: "/profile/settings",
    icon: Settings,
    end: true,
  },
];

const AccountSidebar = ({ onNavigate }: AccountSidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full">
      
      <div className="flex p-3 items-center border rounded-xl gap-3 mb-6 bg-card shadow border-b border-border">
        <div className="">
          <CircleUser size={28} />
        </div>
        <div>
          <h2 className="truncate text-lg font-semibold text-foreground">
            {user?.name || "My Account"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account
          </p>
        </div>
      </div>

      {/* Account navigation */}
      <nav className="space-y-1 bg-card rounded-xl px-1 py-3 shadow">
        {accountMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <div className="mt-6 border-t border-border pt-4">
          <Popconfirm
            title="Are you sure?"
            description="Do you want to log out?"
            onConfirm={logout}
          >
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </Popconfirm>
        </div>
      </nav>

      {/* Logout */}
    </aside>
  );
};

export default AccountSidebar;
