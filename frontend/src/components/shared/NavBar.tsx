import { CircleUser, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "antd";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProduct } from "@/features/products/context/ProductContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { filters, setFilters } = useProduct();
  const search = filters.search ?? "";
  const location = useLocation();
  const isAccountPage = location.pathname.startsWith("/profile");

  const userInitials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U";
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-xl">
      {/* Mobile Account Header */}
      {isAccountPage && (
        <nav
          className="mx-auto flex h-16 items-center gap-3 px-4 md:hidden"
          aria-label="Account navigation"
        >
          <Link
            to="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-foreground"
          >
            Kinetic<span className="text-primary">.</span>
          </Link>

          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-surface-low px-3">
            <Search size={16} className="shrink-0 text-muted-foreground" />

            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={search}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  search: e.target.value,
                }))
              }
              className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          <Link
            to="/profile"
            aria-label="Your account"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
          >
            {userInitials}
          </Link>
        </nav>
      )}

      {/* Standard Navigation */}
      <nav
        className={`${isAccountPage ? "hidden md:flex" : "flex"} mx-auto min-h-16 max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-5 md:flex-nowrap md:gap-4 md:px-10 md:py-0`}
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-foreground"
        >
          Kinetic<span className="text-primary">.</span>
        </Link>

        <label className="order-3 flex w-full items-center gap-2 rounded-full border border-border bg-surface-low px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-primary/20 md:order-none md:max-w-md md:flex-1">
          <Search size={16} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={search}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                search: e.target.value,
              }))
            }
            className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>

        <ul className="ml-auto hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-xs text-muted-foreground transition hover:text-primary"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link to="/wishlist" aria-label="Wishlist">
            <Button type="text" shape="circle">
              <Heart size={19} />
            </Button>
          </Link>

          <Link to="/cart" aria-label="Cart">
            <Button type="text" shape="circle">
              <ShoppingBag size={19} />
            </Button>
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" aria-label="Account">
              <CircleUser size={21} />
            </Link>
          ) : (
            <Link to="/login">
              <Button size="middle" type="primary">
                Login
              </Button>
            </Link>
          )}

          <button
            className="rounded-full p-2 text-foreground hover:bg-surface-low lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {!isAccountPage && isMenuOpen && (
        <div className="border-t border-border bg-surface lg:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-xs text-muted-foreground transition hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default NavBar;
