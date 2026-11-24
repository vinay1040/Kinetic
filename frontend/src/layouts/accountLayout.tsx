
import { Outlet } from "react-router";
import AccountSidebar from "@/features/account/components/accountSideBar";

const AccountLayout = () => {
  return (
    <div className="min-h-screen bg-background m-2">
      <div className="mx-auto flex w-full max-w-screen flex-col p-3 gap-6 md:flex-row md:gap-4 ">
        {/* Desktop sidebar */}
        <aside className="hidden shrink-0 md:block md:w-60">
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
