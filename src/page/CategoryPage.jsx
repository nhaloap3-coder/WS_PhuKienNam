import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/css/style.css";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    try {
      // Lấy thông tin danh mục
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (catError) throw catError;
      setCategory(catData);

      // Lấy sản phẩm thuộc danh mục
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("category", catData.name)
        .order("rating_rate", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!category) {
    return (
      <div className="not-found">
        <h3>Không tìm thấy danh mục!</h3>
        <button onClick={() => navigate("/san-pham")}>
          Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-banner">
          <img src={category.image} alt={category.name} />
          <div className="category-info">
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <p className="product-count">{products.length} sản phẩm</p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>Chưa có sản phẩm nào trong danh mục này</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
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
                <h4>{product.title}</h4>
                <p className="brand">{product.brand}</p>
                <div className="rating">
                  <span className="stars">⭐ {product.rating_rate}</span>
                  <span className="count">({product.rating_count})</span>
                </div>
                <p className="price">
                  {product.price.toLocaleString("vi-VN")}đ
                </p>
                <p className="stock">Còn lại: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
