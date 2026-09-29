import { Outlet } from "react-router";
import AccountSidebar from "@/components/account/accountSideBar";

const AccountLayout = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 md:py-8">
      <AccountSidebar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;