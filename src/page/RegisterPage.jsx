import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/css/login.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullname: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa lỗi khi user nhập lại
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate fullname
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ tên";
    }

    // Validate phone (optional but if provided, must be valid)
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Kiểm tra username đã tồn tại chưa
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("username", formData.username)
        .single();

      if (existingUser) {
        setErrors({ username: "Tên đăng nhập đã tồn tại" });
        setLoading(false);
        return;
      }

      // Kiểm tra email đã tồn tại chưa
      const { data: existingEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email)
        .single();

      if (existingEmail) {
        setErrors({ email: "Email đã được sử dụng" });
        setLoading(false);
        return;
      }

      // Tạo tài khoản mới
      // LƯU Ý: Trong thực tế, cần hash password ở backend!
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            username: formData.username.trim(),
            password_hash: formData.password, // DEMO - Cần hash thật!
            email: formData.email.trim(),
            fullname: formData.fullname.trim(),
            phone: formData.phone.trim() || null,
            role: "customer",
            status: "active",
          },
        ])
        .select();

      if (error) throw error;

      alert("✅ Đăng ký thành công!\n\nBạn có thể đăng nhập ngay bây giờ.");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("❌ Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ maxWidth: "500px" }}>
        <div className="login-icon">📝</div>

        <h2 className="login-title">Đăng ký tài khoản</h2>
        <p className="login-subtitle">Tạo tài khoản mới để mua sắm</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="form-group">
            <label>
              Tên đăng nhập <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ít nhất 3 ký tự"
            />
            {errors.username && (
              <small style={{ color: "red" }}>{errors.username}</small>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
            {errors.email && (
              <small style={{ color: "red" }}>{errors.email}</small>
            )}
          </div>

          {/* Fullname */}
          <div className="form-group">
            <label>
              Họ và tên <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullname && (
              <small style={{ color: "red" }}>{errors.fullname}</small>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0901234567"
            />
            {errors.phone && (
              <small style={{ color: "red" }}>{errors.phone}</small>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>
              Mật khẩu <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
            />
            {errors.password && (
              <small style={{ color: "red" }}>{errors.password}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>
              Xác nhận mật khẩu <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && (
              <small style={{ color: "red" }}>{errors.confirmPassword}</small>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="register-link">
          Đã có tài khoản?{" "}
          <a href="/login" style={{ fontWeight: "bold" }}>
            Đăng nhập ngay
          </a>
        </p>

        <div className="back-home">
          <a href="/">← Quay về trang chủ</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
