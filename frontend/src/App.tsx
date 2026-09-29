import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Store from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Cart from "./pages/Cart";
import AuthLayout from "./layouts/AuthLayouts";
import { Login } from "./pages/Login";
import SignUp from "./pages/SignUp";
import Wishlist from "./pages/WishList";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AccountLayout from "./layouts/accountLayout";
import AccountOverview from "./components/account/accountOverview";
import Orders from "./components/account/Orders";
import Setting from "./pages/Setting";
import OrderDetail from "./components/account/OrderDetail";
import AdminLayout from "./layouts/AdminLayouts";
import AdminDashboard from "./components/admin/AdminDashboard";
import { ProductProvider } from "./context/ProductContext";

const App = () => {
  return (
    <div>
      <ProductProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                  </Route>
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />
                  </Route>
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route element={<AccountLayout />}>
                        <Route path="/profile" element={<AccountOverview />} />
                        <Route
                          path="/profile/orders"
                          element={<Orders></Orders>}
                        />
                        <Route
                          path="/profile/orders/:orderId"
                          element={<OrderDetail />}
                        />
                        <Route path="/profile/settings" element={<Setting />} />
                      </Route>

                      <Route path="/wishlist" element={<Wishlist />} />

                      <Route path="/cart" element={<Cart />} />
                    </Route>
                  </Route>
                  <Route element={<ProtectedRoute allowedRole="admin" />}>
                    {" "}
                    <Route path="/admin" element={<AdminLayout />}>
                      {" "}
                      <Route index element={<AdminDashboard />} />
                      <Route path="orders" element={<div>Orders</div>} />
                      <Route path="products" element={<div>Products</div>} />
                      <Route path="inventry" element={<div>inventry</div>} />
                      <Route path="users" element={<div>Users</div>} />
                      <Route path="settings" element={<div>Settings</div>} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ProductProvider>
    </div>
  );
};

export default App;
