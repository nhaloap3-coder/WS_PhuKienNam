import "./assets/css/main.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load cart count
    updateCartCount();

    // Listen for cart changes
    const handleStorage = () => {
      updateCartCount();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="layout-wrapper">
      <header>
        <div className="header-top">
          <div className="container">
            <div className="logo-section" onClick={() => navigate("/")}>
              <h1>PHỤ KIỆN NAM</h1>
              <p>Đẳng cấp thời trang</p>
            </div>

            <div className="header-actions">
              <div className="cart-icon" onClick={() => navigate("/gio-hang")}>
                🛒
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>

              {user ? (
                <div className="user-menu">
                  <span className="username">👤 {user.username}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  className="login-btn"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>

        <nav className="main-nav">
          <div className="container">
            <a href="/" className="nav-link">
              Trang chủ
            </a>
            <a href="/san-pham" className="nav-link">
              Sản phẩm
            </a>
            <a href="/danh-muc/dong-ho" className="nav-link">
              Đồng hồ
            </a>
            <a href="/danh-muc/vi-da" className="nav-link">
              Ví da
            </a>
            <a href="/danh-muc/that-lung" className="nav-link">
              Thắt lưng
            </a>
            <a href="/danh-muc/kinh-mat" className="nav-link">
              Kính mát
            </a>

            {user && user.role === "admin" && (
              <>
                <a href="/admin/users" className="nav-link admin-link">
                  Người dùng
                </a>
                <a href="/admin/products" className="nav-link admin-link">
                  Quản lý SP
                </a>
                <a href="/admin/orders" className="nav-link admin-link">
                  Đơn hàng
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="main-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Về chúng tôi</h3>
              <p>
                Phụ Kiện Nam chuyên cung cấp các sản phẩm phụ kiện nam giới cao
                cấp, chính hãng với giá tốt nhất thị trường.
              </p>
            </div>

            <div className="footer-col">
              <h3>Liên kết</h3>
              <ul>
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/san-pham">Sản phẩm</a>
                </li>
                <li>
                  <a href="/gio-hang">Giỏ hàng</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Chính sách</h3>
              <ul>
                <li>Chính sách đổi trả</li>
                <li>Chính sách bảo mật</li>
                <li>Điều khoản sử dụng</li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Liên hệ</h3>
              <p>📧 contact@phukiennam.vn</p>
              <p>📞 1900 xxxx</p>
              <p>📍 TP. Hồ Chí Minh</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Phụ Kiện Nam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
