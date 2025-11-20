import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./assets/css/style.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("id");
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*");

      // Lọc theo danh mục
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // Sắp xếp
      switch (sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating_rate", { ascending: false });
          break;
        case "name":
          query = query.order("title", { ascending: true });
          break;
        default:
          query = query.order("id", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo tìm kiếm
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list-page">
      <div className="page-header">
        <h1>Tất cả sản phẩm</h1>
        <p>Khám phá bộ sưu tập phụ kiện nam cao cấp</p>
      </div>

      <div className="filter-section">
        {/* Tìm kiếm */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lọc danh mục */}
        <div className="filter-group">
          <label>Danh mục:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sắp xếp */}
        <div className="filter-group">
          <label>Sắp xếp:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Mặc định</option>
            <option value="name">Tên A-Z</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          <div className="result-count">
            Tìm thấy {filteredProducts.length} sản phẩm
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/san-pham/${product.id}`)}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="badge low-stock">Sắp hết</span>
                  )}
                  {product.stock === 0 && (
                    <span className="badge out-stock">Hết hàng</span>
                  )}
                </div>
                <div className="product-info">
                  <span className="category">{product.category}</span>
                  <h4>{product.title}</h4>
                  <p className="brand">{product.brand}</p>
                  <div className="rating">
                    <span className="stars">⭐ {product.rating_rate}</span>
                    <span className="count">({product.rating_count})</span>
                  </div>
                  <p className="price">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="stock">Còn lại: {product.stock} sản phẩm</p>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>Không tìm thấy sản phẩm phù hợp</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
