import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <div className="w-full">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">
              Kinetic<span className="text-blue-600">.</span>
            </h1>
          </div>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;