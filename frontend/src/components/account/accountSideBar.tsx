import { Link, useLocation } from "react-router";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AccountSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Overview",
      path: "/profile",
      icon: User,
    },
    {
      label: "Orders",
      path: "/profile/orders",
      icon: ShoppingBag,
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      icon: Heart,
    },
    
    {
      label: "Settings",
      path: "/profile/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full rounded-xl border bg-white p-4 md:w-64">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">My Account</h2>
        <p className="text-sm text-gray-500">
          Manage your account
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t pt-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AccountSidebar;