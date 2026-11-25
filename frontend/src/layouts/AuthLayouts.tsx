import { Divider, Typography } from "antd";
import { Outlet } from "react-router";
import loginImg from "@/assets/loginImg.png";

import {
  SafetyCertificateOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { ShoppingCart } from "lucide-react";

const { Title, Text } = Typography;

const AuthLayout = () => {
  return (
    <main className="h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <section className="relative hidden lg:flex max-h-screen flex-col justify-between overflow-hidden bg-[#06172e] p-8 xl:p-12 2xl:p-16 text-white">
        <img
          src={loginImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#06172e]/95 via-[#06172e]/75 to-[#06172e]/90" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-400/15 border border-blue-300/20 px-4 py-2 text-xs text-blue-200">
            <ThunderboltFilled />
            Kinetic Commerce Platform
          </div>

          <Title className="!text-white !text-3xl xl:!text-4xl 2xl:!text-5xl !font-bold !mt-8 !mb-5 !leading-tight">
            Built for modern commerce.
            <br />
            Designed for performance.
          </Title>

          <Text className="!text-gray-300 text-sm xl:text-base leading-7 block max-w-lg">
            Manage your products, orders, inventory and customer experience
            through one powerful commerce platform.
          </Text>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 xl:p-6 max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <Text className="!text-blue-200 text-xs font-semibold uppercase tracking-wider">
              Platform Overview
            </Text>
            <span className="flex items-center gap-2 text-xs text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Operational
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="!text-gray-300 text-xs">
                Commerce Management
              </Text>
              <Title level={3} className="!text-white !mb-0 !mt-2">
                Unified
              </Title>
              <Text className="!text-green-300 text-xs">
                One connected platform
              </Text>
            </div>
            <div>
              <Text className="!text-gray-300 text-xs">Inventory Control</Text>
              <Title level={3} className="!text-white !mb-0 !mt-2">
                Real-time
              </Title>
              <Text className="!text-green-300 text-xs">
                Smarter operations
              </Text>
            </div>
          </div>

          <Divider className="!border-white/15 !my-5" />

          <div className="flex items-center gap-3">
            <SafetyCertificateOutlined className="text-blue-300 text-xl" />

            <Text className="!text-gray-300 text-xs">
              Secure authentication and protected access.
            </Text>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex justify-between gap-4 text-xs text-gray-400">
          <span>Powering modern commerce</span>
          <span>Kinetic Commerce</span>
        </div>
      </section>

      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-10 sm:px-8 lg:px-10 xl:px-14">
        {/* Mobile Branding */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-700">
            <ShoppingCart className="text-white text-xl" />
          </div>

          <div>
            <Title level={4} className="!mb-0">
              Kinetic
            </Title>

            <Text type="secondary" className="text-xs">
              Commerce Platform
            </Text>
          </div>
        </div>
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>


      </section>
    </main>
  );
};

export default AuthLayout;
