import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "antd";
import { Link, NavLink, useLocation } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";
import SearchInput from "./SearchInput";
import { Avatar } from "./Avatar";
import CategoryNav from "./CategoryNav";

export const NavBar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isAccountPage = location.pathname.startsWith("/profile");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center gap-3 py-3 lg:gap-6">
          <Link
            to="/"
            aria-label="Kinetic home"
            className="shrink-0 text-2xl font-bold tracking-tight text-foreground"
          >
            Kinetic<span className="text-primary">.</span>
          </Link>
          <div className="hidden min-w-0 flex-1 md:block">
            <SearchInput />
          </div>
          {!isAccountPage && (
            <nav className="hidden shrink-0 items-center gap-5 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link to="/wishlist" aria-label="Wishlist">
              <Button
                type="text"
                shape="circle"
                className="!size-10"
                icon={<Heart size={20} />}
              />
            </Link>
            <Link to="/cart" aria-label="Shopping cart">
              <Button
                type="text"
                shape="circle"
                className="!size-10"
                icon={<ShoppingBag size={20} />}
              />
            </Link>
            {isAuthenticated ? (
              <Avatar />
            ) : (
              <Link to="/login">
                <Button type="primary">Login</Button>
              </Link>
            )}
          </div>
        </div>
        {!isAccountPage && (
          <div className="pb-3 md:hidden">
            <SearchInput />
          </div>
        )}
      </div>
      {!isAccountPage && <CategoryNav />}
    </header>
  );
};
