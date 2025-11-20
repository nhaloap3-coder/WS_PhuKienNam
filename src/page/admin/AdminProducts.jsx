import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../../assets/css/style.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${title}"?`)) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        alert("✅ Đã xóa sản phẩm!");
        fetchProducts();
      } catch (error) {
        alert("❌ Lỗi khi xóa: " + error.message);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý sản phẩm</h1>
        <div className="admin-actions">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/products/edit/new")}
          >
            ➕ Thêm sản phẩm mới
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Tổng sản phẩm</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {products.filter((p) => p.stock > 0).length}
          </div>
          <div className="stat-label">Còn hàng</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {products.filter((p) => p.stock === 0).length}
          </div>
          <div className="stat-label">Hết hàng</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {products.filter((p) => p.stock < 10 && p.stock > 0).length}
          </div>
          <div className="stat-label">Sắp hết</div>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img src={p.image} alt={p.title} className="product-thumb" />
                </td>
                <td className="product-title">{p.title}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td className="price">{p.price.toLocaleString("vi-VN")}đ</td>
                <td>
                  <span
                    className={`stock-badge ${
                      p.stock === 0 ? "out" : p.stock < 10 ? "low" : "in"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td>
                  ⭐ {p.rating_rate} ({p.rating_count})
                </td>
                <td className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(p.id, p.title)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-results">Không tìm thấy sản phẩm</div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
