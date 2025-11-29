import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/css/login.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo("");

    console.log("🔐 Bắt đầu đăng nhập...");
    console.log("Username:", username);

    try {
      // Bước 1: Kiểm tra username có tồn tại không
      console.log("Bước 1: Tìm user với username:", username.trim());

      const { data: users, error: searchError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username.trim());

      console.log("Kết quả tìm kiếm:", users);

      if (searchError) {
        console.error("❌ Lỗi tìm kiếm:", searchError);
        setError("Lỗi kết nối database: " + searchError.message);
        setDebugInfo(`Error: ${searchError.message}`);
        setLoading(false);
        return;
      }

      if (!users || users.length === 0) {
        console.log("❌ Không tìm thấy username");
        setError("Tên đăng nhập không tồn tại!");
        setDebugInfo(`Username "${username}" không tồn tại trong database`);
        setLoading(false);
        return;
      }

      const user = users[0];
      console.log("✅ Tìm thấy user:", {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
      });

      // Bước 2: Kiểm tra password
      console.log("Bước 2: Kiểm tra password...");
      console.log("Password nhập vào:", password);
      console.log("Password trong DB:", user.password_hash);

      // DEMO: So sánh trực tiếp (trong thực tế cần dùng bcrypt)
      if (password !== user.password_hash) {
        console.log("❌ Password không khớp!");
        setError("Mật khẩu không đúng!");
        setDebugInfo(
          `Password không khớp. Nhập: "${password}", DB: "${user.password_hash}"`
        );
        setLoading(false);
        return;
      }

      console.log("✅ Password đúng!");

      // Bước 3: Kiểm tra trạng thái tài khoản
      console.log("Bước 3: Kiểm tra status...");

      if (user.status === "banned") {
        console.log("❌ Tài khoản bị khóa");
        setError("Tài khoản của bạn đã bị khóa!");
        setDebugInfo(`Status: banned - Liên hệ admin để được hỗ trợ`);
        setLoading(false);
        return;
      }

      if (user.status === "inactive") {
        console.log("❌ Tài khoản chưa kích hoạt");
        setError("Tài khoản của bạn chưa được kích hoạt!");
        setDebugInfo(`Status: inactive - Cần xác thực email`);
        setLoading(false);
        return;
      }

      console.log("✅ Status OK:", user.status);

      // Bước 4: Cập nhật last_login
      console.log("Bước 4: Cập nhật last_login...");

      const { error: updateError } = await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) {
        console.warn("⚠️ Không cập nhật được last_login:", updateError);
        // Không chặn đăng nhập, chỉ log warning
      } else {
        console.log("✅ Đã cập nhật last_login");
      }

      // Bước 5: Lưu thông tin vào localStorage
      console.log("Bước 5: Lưu vào localStorage...");

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        points: user.points || 0,
        avatar: user.avatar_url,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Đã lưu user vào localStorage:", userData);

      // Bước 6: Chuyển trang
      console.log("Bước 6: Chuyển hướng theo role:", user.role);

      alert(`✅ Chào mừng ${user.fullname}!`);

      if (user.role === "admin") {
        console.log("→ Chuyển đến /admin/products");
        navigate("/admin/products");
      } else {
        console.log("→ Chuyển đến /");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Lỗi không mong muốn:", err);
      setError("Có lỗi xảy ra: " + err.message);
      setDebugInfo(`Exception: ${err.message}\nStack: ${err.stack}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm test nhanh với tài khoản demo
  const quickLogin = async (demoUsername, demoPassword) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    // Trigger form submit
    setTimeout(() => {
      document.getElementById("loginForm").requestSubmit();
    }, 100);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-icon">🔐</div>

        <h2 className="login-title">Đăng nhập</h2>
        <p className="login-subtitle">Chào mừng bạn quay trở lại</p>

        {/* Hiển thị lỗi */}
        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid #f5c6cb",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Debug info */}
        {debugInfo && (
          <details
            style={{
              background: "#fff3cd",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "12px",
            }}
          >
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              🔍 Debug Info (click để xem)
            </summary>
            <pre style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
              {debugInfo}
            </pre>
          </details>
        )}

        <form onSubmit={handleLogin} id="loginForm" className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
                setDebugInfo("");
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setDebugInfo("");
              }}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div style={{ textAlign: "center", margin: "15px 0" }}>
          <a
            href="/forgot-password"
            style={{ color: "#667eea", fontSize: "14px" }}
          >
            Quên mật khẩu?
          </a>
        </div>

        <p className="register-link">
          Bạn chưa có tài khoản?{" "}
          <a href="/register" style={{ fontWeight: "bold" }}>
            Đăng ký ngay
          </a>
        </p>

        <div className="back-home">
          <a href="/">← Quay về trang chủ</a>
        </div>

        {/* Tài khoản demo với nút quick login */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#e7f3ff",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          <strong>🧪 Tài khoản demo - Click để đăng nhập nhanh:</strong>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => quickLogin("admin", "admin123")}
              style={{
                background: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              👤 Admin (admin / admin123)
            </button>
            <button
              type="button"
              onClick={() => quickLogin("staff01", "staff123")}
              style={{
                background: "#17a2b8",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              👤 Staff (staff01 / staff123)
            </button>
            <button
              type="button"
              onClick={() => quickLogin("customer01", "customer123")}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              👤 Customer (customer01 / customer123)
            </button>
          </div>

          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "#fff",
              borderRadius: "5px",
              fontSize: "11px",
            }}
          >
            <strong>⚠️ Quan trọng:</strong>
            <br />
            Nếu không đăng nhập được, vui lòng:
            <ol style={{ marginTop: "5px", paddingLeft: "20px" }}>
              <li>Mở Console (F12) để xem log chi tiết</li>
              <li>
                Kiểm tra bảng <code>users</code> có dữ liệu chưa
              </li>
              <li>
                Chạy SQL:{" "}
                <code>ALTER TABLE users DISABLE ROW LEVEL SECURITY;</code>
              </li>
              <li>Kiểm tra supabaseClient.js có đúng URL và API Key</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
