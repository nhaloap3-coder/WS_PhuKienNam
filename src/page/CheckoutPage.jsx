import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/css/style.css";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    payment_method: "cod",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartData.length === 0) {
      alert("Giỏ hàng trống!");
      navigate("/gio-hang");
    }
    setCart(cartData);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = subtotal >= 500000 ? 0 : 30000;
    return subtotal + shipping;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Tạo đơn hàng
      const orderData = {
        ...formData,
        total_amount: calculateTotal(),
        status: "pending",
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Tạo chi tiết đơn hàng
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_title: item.title,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Cập nhật số lượng tồn kho
      for (const item of cart) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        if (product) {
          await supabase
            .from("products")
            .update({ stock: product.stock - item.quantity })
            .eq("id", item.id);
        }
      }

      // 4. Xóa giỏ hàng
      localStorage.removeItem("cart");

      alert(
        `✅ Đặt hàng thành công! Mã đơn hàng: #${order.id}\nChúng tôi sẽ liên hệ với bạn sớm nhất.`
      );
      navigate("/");
    } catch (error) {
      console.error("Lỗi:", error.message);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Thanh toán</h1>

      <div className="checkout-content">
        <div className="checkout-form">
          <h2>Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10,11}"
                placeholder="0901234567"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ giao hàng *</label>
              <textarea
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>

            <div className="form-group">
              <label>Phương thức thanh toán *</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                <option value="momo">Ví MoMo</option>
                <option value="zalopay">ZaloPay</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ghi chú (không bắt buộc)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="2"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng..."
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Đơn hàng của bạn</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <p className="item-name">{item.title}</p>
                  <p className="item-quantity">Số lượng: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>
                {cart
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString("vi-VN")}
                đ
              </span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>
                {cart.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ) >= 500000
                  ? "Miễn phí"
                  : "30.000đ"}
              </span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{calculateTotal().toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
