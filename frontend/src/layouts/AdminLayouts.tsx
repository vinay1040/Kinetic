import {
  ShoppingCartOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Avatar, Button, Drawer, Grid } from "antd";

import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import { AdminSiderBar } from "@/features/admin/components/AdminSideBar";

const AdminLayout = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screen = Grid.useBreakpoint();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const isDesktop = screen.lg;
  return (
    <div className="grid h-dvh grid-cols-1 overflow-hidden lg:grid-cols-[230px_minmax(0,1fr)]">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside className="flex min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
          <div className="flex h-20 items-center gap-3 px-6">
            <div className="flex items-center  bg-[#004AC6] text-white rounded-xl justify-center size-10 ">
              <ShoppingCartOutlined className="text-xl" />
            </div>
            <div className="shrink-0 border-b">
              <span className="text-xl font-bold text-[#004AC6]">Kinetic</span>
            </div>
          </div>
          {/* Navigation */}
          <AdminSiderBar
            onNavigate={() => setDrawerOpen(false)}
          ></AdminSiderBar>
          {/* Logout */}
          <div className="shrink-0 border-t p-3">
            <Button danger type="text" block onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </aside>
      )}

      <div className="grid min-h-0 min-w-0 grid-rows-[54px_minmax(0,1fr)] overflow-hidden">
        <header className="z-30 flex items-center justify-between border-b border-[#E5ECF8] bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              className="min-[992px]:!hidden"
            />

            <h1 className="text-lg font-semibold text-[#17233C]">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="!bg-[#004AC6]">A</Avatar>

            <span className="hidden text-sm font-medium text-[#17233C] sm:block">
              Administrator
            </span>
          </div>
        </header>

        <div className="min-h-0 overflow-y-auto overflow-x-hidden">
          <main className="min-w-0 p-2">
            <Outlet />
          </main>

          <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-400">
            Kinetic Admin Panel © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
      <Drawer
        placement="left"
        width={270}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-[#E5ECF8] px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#004AC6] text-white">
            <ShoppingCartOutlined className="text-xl" />
          </div>

          <span className="text-xl font-bold text-[#004AC6]">Kinetic</span>
        </div>

        {/* Navigation */}
        <AdminSiderBar onNavigate={() => setDrawerOpen(false)} />

        {/* Logout */}
        <div className="shrink-0 border-t border-[#E5ECF8] p-3">
          <Button
            danger
            type="text"
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default AdminLayout;
