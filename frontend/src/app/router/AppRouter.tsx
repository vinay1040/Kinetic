import AccountOverview from "@/features/account/components/accountOverview";
import OrderDetail from "@/features/orders/components/OrderDetail";
import Orders from "@/features/orders/components/Orders";
import AdminDashboard from "@/features/admin/dashboard/pages/AdminDashboard";
import AdminOrders from "@/features/orders/components/adminOrder";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import Cart from "@/features/cart/components/Cart";
import { SettingPage } from "@/features/settings/components/settingPage";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";
import ProductDetail from "@/features/products/components/ProductDetail";
import AccountLayout from "@/layouts/accountLayout";
import AdminLayout from "@/layouts/AdminLayouts";
import AuthLayout from "@/layouts/AuthLayouts";
import MainLayout from "@/layouts/MainLayout";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/WishList";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@/pages/Home";
import Store from "@/pages/Store";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signUp" element={<SignupForm />} />
        </Route>

        {/* Authenticated customer routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route element={<AccountLayout />}>
              <Route path="/profile" element={<AccountOverview />} />
              <Route path="/profile/orders" element={<Orders />} />
              <Route
                path="/profile/orders/:orderId"
                element={<OrderDetail />}
              />
              <Route path="/profile/settings" element={<SettingPage />} />
            </Route>

            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<div>Products</div>} />
            <Route path="inventry" element={<div>inventry</div>} />
            <Route path="users" element={<div>Users</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
