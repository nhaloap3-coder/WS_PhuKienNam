import "./styles.css";

//@ts-ignore
import Layout from "./Layout";
//@ts-ignore
import HomePage from "./page/HomePage";
//@ts-ignore
import ProductList from "./ProductList";
//@ts-ignore
import ProductDetail from "./page/ProductDetail";
//@ts-ignore
import CategoryPage from "./page/CategoryPage";
//@ts-ignore
import CartPage from "./page/CartPage";
//@ts-ignore
import CheckoutPage from "./page/CheckoutPage";
//@ts-ignore
import LoginPage from "./page/LoginPage";
//@ts-ignore
import LogoutPage from "./page/LogoutPage";
//@ts-ignore
import AdminEditProduct from "./page/admin/AdminEditProduct";
//@ts-ignore
import AdminProducts from "./page/admin/AdminProducts";
//@ts-ignore
import AdminOrders from "./page/admin/AdminOrders";
//@ts-ignore
import AdminOrderDetail from "./page/admin/AdminOrderDetail";
//@ts-ignore
import ProtectedRoute from "./ProtectedRoute";

import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="san-pham" element={<ProductList />} />
          <Route path="san-pham/:id" element={<ProductDetail />} />
          <Route path="danh-muc/:slug" element={<CategoryPage />} />
          <Route path="gio-hang" element={<CartPage />} />
          <Route path="thanh-toan" element={<CheckoutPage />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="logout" element={<LogoutPage />} />

          <Route
            path="admin/products"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/products/edit/:id"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminEditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/orders/:id"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminOrderDetail />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
