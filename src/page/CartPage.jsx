import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <button onClick={() => navigate("/san-pham")}>Tiếp tục mua sắm</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Giỏ hàng của bạn</h1>
        <button className="clear-cart" onClick={clearCart}>
          Xóa tất cả
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.title}
                onClick={() => navigate(`/san-pham/${item.id}`)}
              />
              <div className="item-info">
                <h3
                  onClick={() => navigate(`/san-pham/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {item.title}
                </h3>
                <p className="item-price">
                  {item.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                  }
                  min="1"
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-subtotal">
                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
              </div>
              <button
                className="remove-item"
                onClick={() => removeItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{calculateTotal().toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>
              {calculateTotal() >= 500000 ? (
                <>
                  <s>30.000đ</s> <strong>Miễn phí</strong>
                </>
              ) : (
                "30.000đ"
              )}
            </span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>
              {(
                calculateTotal() + (calculateTotal() >= 500000 ? 0 : 30000)
              ).toLocaleString("vi-VN")}
              đ
            </span>
          </div>
          {calculateTotal() < 500000 && (
            <p className="free-shipping-note">
              Mua thêm {(500000 - calculateTotal()).toLocaleString("vi-VN")}đ để
              được miễn phí vận chuyển
            </p>
          )}
          <button
            className="checkout-button"
            onClick={() => navigate("/thanh-toan")}
          >
            Tiến hành thanh toán
          </button>
          <button
            className="continue-shopping"
            onClick={() => navigate("/san-pham")}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
