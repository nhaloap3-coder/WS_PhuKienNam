import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username.trim() && password.trim()) {
        localStorage.setItem(
          "user",
          JSON.stringify({ username, role: "user" })
        );
        alert("✅ Đăng nhập thành công!");

        // Nếu là admin thì chuyển về trang quản trị
        if (username === "admin") {
          navigate("/admin/products");
        } else {
          navigate("/");
        }
      } else {
        alert("❌ Vui lòng nhập đầy đủ thông tin!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-icon">🔐</div>

        <h2 className="login-title">Đăng nhập</h2>
        <p className="login-subtitle">Chào mừng bạn quay trở lại</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <small>💡 Dùng "admin" để truy cập trang quản trị</small>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="register-link">
          Bạn chưa có tài khoản? <a href="#">Đăng ký ngay</a>
        </p>

        <div className="back-home">
          <a href="/">← Quay về trang chủ</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
