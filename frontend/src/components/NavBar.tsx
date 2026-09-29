import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { Button, Dropdown } from "antd";
import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const userMenu = [
    {
      key: "user",
      label: (
        <div className="px-2 py-1">
          <p className="font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "wishlist",
      label: <Link to="/wishlist">Wishlist</Link>,
    },
    {
      key: "cart",
      label: <Link to="/cart">Cart</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Logout",
      onClick: logout,
    },
  ];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 md:px-10"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-slate-950"
        >
          Kinetic<span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="ml-auto hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-xs text-slate-600 transition hover:text-blue-600"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {/* Wishlist */}
          <Link to="/wishlist" aria-label="Wishlist">
            <Button
              type="text"
              shape="circle"
              className="rounded-full text-slate-800 hover:bg-slate-100"
            >
              <Heart size={19} />
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart" aria-label="Cart">
            <Button
              type="text"
              shape="circle"
              className="rounded-full text-slate-800 hover:bg-slate-100"
            >
              <ShoppingBag size={19} />
            </Button>
          </Link>

          {/* Authentication */}
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenu }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="primary"
                className="ml-1 rounded-full bg-slate-950 px-4 text-xs hover:bg-blue-700"
              >
                {user?.name}
              </Button>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button
                size="middle"
                type="primary"
                className="ml-1 rounded-full bg-slate-950 px-4 text-xs hover:bg-blue-700"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-xs text-slate-600 transition hover:text-blue-600"
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