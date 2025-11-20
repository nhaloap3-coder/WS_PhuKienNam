import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../assets/css/style.css";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      // Lấy thông tin đơn hàng
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
      if (orderError) throw orderError;
      setOrder(orderData);

      // Lấy chi tiết sản phẩm
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);
      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
      alert("Không tìm thấy đơn hàng!");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      alert("✅ Đã cập nhật trạng thái!");
      fetchOrderDetail();
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const printOrder = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!order) {
    return <div className="not-found">Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="admin-container order-detail-page">
      <div className="order-detail-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <h1>Chi tiết đơn hàng #{order.id}</h1>
        <button className="btn btn-print" onClick={printOrder}>
          🖨️ In đơn hàng
        </button>
      </div>

      <div className="order-detail-grid">
        {/* Thông tin khách hàng */}
        <div className="detail-card">
          <h2>Thông tin khách hàng</h2>
          <div className="info-row">
            <strong>Họ tên:</strong>
            <span>{order.customer_name}</span>
          </div>
          <div className="info-row">
            <strong>Email:</strong>
            <span>{order.customer_email}</span>
          </div>
          <div className="info-row">
            <strong>Số điện thoại:</strong>
            <span>{order.customer_phone}</span>
          </div>
          <div className="info-row">
            <strong>Địa chỉ:</strong>
            <span>{order.customer_address}</span>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="detail-card">
          <h2>Thông tin đơn hàng</h2>
          <div className="info-row">
            <strong>Mã đơn hàng:</strong>
            <span>#{order.id}</span>
          </div>
          <div className="info-row">
            <strong>Ngày đặt:</strong>
            <span>{new Date(order.created_at).toLocaleString("vi-VN")}</span>
          </div>
          <div className="info-row">
            <strong>Phương thức thanh toán:</strong>
            <span>{order.payment_method}</span>
          </div>
          <div className="info-row">
            <strong>Trạng thái:</strong>
            <span className={`status-badge status-${order.status}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          {order.note && (
            <div className="info-row">
              <strong>Ghi chú:</strong>
              <span>{order.note}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cập nhật trạng thái */}
      <div className="status-update-section">
        <h3>Cập nhật trạng thái đơn hàng:</h3>
        <div className="status-buttons">
          <button
            className="btn status-pending"
            onClick={() => updateStatus("pending")}
            disabled={order.status === "pending"}
          >
            Chờ xử lý
          </button>
          <button
            className="btn status-confirmed"
            onClick={() => updateStatus("confirmed")}
            disabled={order.status === "confirmed"}
          >
            Xác nhận
          </button>
          <button
            className="btn status-shipping"
            onClick={() => updateStatus("shipping")}
            disabled={order.status === "shipping"}
          >
            Đang giao
          </button>
          <button
            className="btn status-delivered"
            onClick={() => updateStatus("delivered")}
            disabled={order.status === "delivered"}
          >
            Đã giao
          </button>
          <button
            className="btn status-cancelled"
            onClick={() => updateStatus("cancelled")}
            disabled={order.status === "cancelled"}
          >
            Hủy đơn
          </button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="detail-card">
        <h2>Sản phẩm đã đặt</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product_title}</td>
                <td>{item.product_price.toLocaleString("vi-VN")}đ</td>
                <td>{item.quantity}</td>
                <td>{item.subtotal.toLocaleString("vi-VN")}đ</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: "right" }}>
                <strong>Tổng cộng:</strong>
              </td>
              <td>
                <strong>{order.total_amount.toLocaleString("vi-VN")}đ</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
