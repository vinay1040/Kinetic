
import { Outlet } from "react-router";
import AccountSidebar from "@/features/account/components/accountSideBar";

const AccountLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 md:py-8">
        {/* Desktop sidebar */}
        <aside className="hidden shrink-0 md:block md:w-64">
          <AccountSidebar />
        </aside>

        {/* Account page content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
