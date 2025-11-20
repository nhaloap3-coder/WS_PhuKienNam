import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  // Lấy dữ liệu user từ localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Nếu chưa đăng nhập → chuyển về trang đăng nhập
  if (!user) {
    alert("⚠️ Vui lòng đăng nhập để tiếp tục!");
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu quyền admin → kiểm tra username
  if (roleRequired === "admin" && user.username !== "admin") {
    alert("❌ Bạn không có quyền truy cập trang quản trị!");
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ → render nội dung bên trong
  return children;
};

export default ProtectedRoute;
