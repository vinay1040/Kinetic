import { Drawer } from "antd";
import { useState } from "react";
import { Outlet } from "react-router";
import { AdminSideBar } from "@/features/admin/components/AdminSideBar";
import { AdminNavbar } from "@/features/admin/components/AdminNavbar";

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`grid h-dvh grid-cols-1 overflow-hidden bg-[#F8FAFC] transition-[grid-template-columns] duration-200 ${
        collapsed
          ? "lg:grid-cols-[72px_minmax(0,1fr)]"
          : "lg:grid-cols-[240px_minmax(0,1fr)]"
      } admin-layout`}
    >
      <aside className="hidden min-h-0 overflow-hidden border-r border-[#E5ECF8] bg-white lg:block">
        <AdminSideBar collapsed={collapsed} />
      </aside>

      <div className="grid min-h-0 min-w-0 grid-rows-[64px_minmax(0,1fr)] scrollbar-none overflow-hidden">
        <AdminNavbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onOpenMobileDrawer={() => setDrawerOpen(true)}
        />

        <div className="flex min-h-0 flex-col overflow-y-auto overflow-x-hidden">
          <main className="mx-auto w-full max-w-[1600px] min-w-0 flex-1 p-2">
            <Outlet />
          </main>
        </div>
      </div>

      <Drawer
        placement="left"
        width={270}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closable={false}
        className="lg:hidden"
        styles={{ body: { padding: 0 } }}
      >
        <AdminSideBar isMobile onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </div>
  );
};

export default AdminLayout;
