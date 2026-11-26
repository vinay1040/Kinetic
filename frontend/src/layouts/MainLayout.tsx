import Footer from "@/components/shared/Footer";
import MobileBottomNav from "@/components/shared/Nav/MobileBottomNav";
import { NavBar } from "@/components/shared/Nav/NavBar";
import { Outlet } from "react-router";

export const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <NavBar />

      <main className="min-w-0 flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};
