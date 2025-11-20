import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa thông tin user trong localStorage
    localStorage.removeItem("user");

    // Hiển thị thông báo rồi tự động chuyển hướng
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-wrapper">
      <div className="logout-card">
        <div className="logout-icon">👋</div>
        <h2>Đăng xuất thành công!</h2>
        <p>Phiên đăng nhập của bạn đã được kết thúc.</p>
        <p className="redirect-text">
          Đang chuyển hướng đến trang đăng nhập...
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;
