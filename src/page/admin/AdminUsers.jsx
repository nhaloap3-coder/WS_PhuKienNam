import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../../assets/css/style.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
      alert("Lỗi khi tải danh sách users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;
      alert("✅ Đã cập nhật trạng thái!");
      fetchUsers();
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (!window.confirm("Bạn có chắc muốn thay đổi vai trò người dùng này?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      alert("✅ Đã cập nhật vai trò!");
      fetchUsers();
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };

  const deleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn XÓA người dùng "${username}"?\n\nHành động này không thể hoàn tác!`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;
      alert("✅ Đã xóa người dùng!");
      fetchUsers();
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchStatus = filterStatus === "all" || user.status === filterStatus;

    return matchSearch && matchRole && matchStatus;
  });

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: "Admin", class: "role-admin" },
      staff: { text: "Nhân viên", class: "role-staff" },
      customer: { text: "Khách hàng", class: "role-customer" },
    };
    return badges[role] || { text: role, class: "" };
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: "Hoạt động", class: "status-active" },
      inactive: { text: "Không hoạt động", class: "status-inactive" },
      banned: { text: "Bị khóa", class: "status-banned" },
    };
    return badges[status] || { text: status, class: "" };
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý người dùng</h1>
        <div className="admin-actions">
          <input
            type="text"
            placeholder="Tìm kiếm user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section" style={{ marginBottom: "20px" }}>
        <div className="filter-group">
          <label>Vai trò:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="admin">Admin</option>
            <option value="staff">Nhân viên</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Tổng users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter((u) => u.role === "customer").length}
          </div>
          <div className="stat-label">Khách hàng</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter((u) => u.status === "active").length}
          </div>
          <div className="stat-label">Đang hoạt động</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users
              .reduce((sum, u) => sum + (u.points || 0), 0)
              .toLocaleString()}
          </div>
          <div className="stat-label">Tổng điểm</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Điểm</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.status);

              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "—"}</td>
                  <td>
                    <select
                      className={`role-select ${roleBadge.class}`}
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="staff">Nhân viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className={`status-select ${statusBadge.class}`}
                      value={user.status}
                      onChange={(e) =>
                        updateUserStatus(user.id, e.target.value)
                      }
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="banned">Khóa</option>
                    </select>
                  </td>
                  <td>
                    <strong style={{ color: "#667eea" }}>
                      {user.points || 0}
                    </strong>
                  </td>
                  <td>
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn btn-view"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      👁️
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteUser(user.id, user.username)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-results">Không tìm thấy user nào</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
