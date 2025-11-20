import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../../assets/css/style.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      alert("✅ Đã cập nhật trạng thái đơn hàng!");
      fetchOrders();
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

  const getStatusClass = (status) => {
    const classMap = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      shipping: "status-shipping",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return classMap[status] || "";
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý đơn hàng</h1>
        <div className="filter-group">
          <label>Lọc theo trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Tổng đơn hàng</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter((o) => o.status === "pending").length}
          </div>
          <div className="stat-label">Chờ xử lý</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter((o) => o.status === "shipping").length}
          </div>
          <div className="stat-label">Đang giao</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="stat-label">Đã giao</div>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>
                  <div>{order.customer_email}</div>
                  <div>{order.customer_phone}</div>
                </td>
                <td className="address">{order.customer_address}</td>
                <td className="price">
                  {order.total_amount.toLocaleString("vi-VN")}đ
                </td>
                <td>{order.payment_method}</td>
                <td>
                  <select
                    className={`status-select ${getStatusClass(order.status)}`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  <button
                    className="btn btn-view"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    👁️ Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-results">Không có đơn hàng nào</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
