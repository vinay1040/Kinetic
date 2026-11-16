import { NavLink } from "react-router";
import { Home, LayoutGrid, Heart, ShoppingBag, UserRound } from "lucide-react";

const mobileNavigationItems = [
  {
    label: "Home",
    path: "/",
    icon: Home,
    end: true,
  },
  {
    label: "Categories",
    path: "/store",
    icon: LayoutGrid,
    end: false,
  },
  {
    label: "Wishlist",
    path: "/wishlist",
    icon: Heart,
    end: true,
  },
  {
    label: "Cart",
    path: "/cart",
    icon: ShoppingBag,
    end: true,
  },
  {
    label: "Account",
    path: "/profile",
    icon: UserRound,
    end: false,
  },
];

const MobileBottomNav = () => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E0E6F2] bg-[#F8F9FF] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-1">
        {mobileNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  isActive
                    ? "text-[#004AC6]"
                    : "text-[#3F465C] hover:text-[#004AC6]"
                }`
              }
            >
              <Icon size={23} strokeWidth={2} />

              <span className="truncate text-[11px] font-medium tracking-wide">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
