import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/css/style.css";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Lấy danh mục
      const { data: cats, error: catsError } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      if (catsError) throw catsError;
      setCategories(cats || []);

      // Lấy sản phẩm nổi bật (rating cao nhất)
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("rating_rate", { ascending: false })
        .limit(8);

      if (productsError) throw productsError;
      setFeaturedProducts(products || []);
    } catch (error) {
      console.error("Lỗi:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>PHỤ KIỆN NAM GIỚI CAO CẤP</h1>
          <p>Nâng tầm phong cách, khẳng định đẳng cấp</p>
          <button className="cta-button" onClick={() => navigate("/san-pham")}>
            Khám phá ngay
          </button>
        </div>
      </section>

      {/* Danh mục */}
      <section className="categories-section">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/danh-muc/${cat.slug}`)}
            >
              <div className="category-image">
                <img src={cat.image} alt={cat.name} />
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="featured-section">
        <h2 className="section-title">Sản phẩm nổi bật</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
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
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            className="view-all-button"
            onClick={() => navigate("/san-pham")}
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      </section>

      {/* Banner quảng cáo */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>ƯU ĐÃI ĐẶC BIỆT</h2>
          <p>Giảm giá lên đến 30% cho khách hàng mới</p>
          <p>Miễn phí vận chuyển đơn hàng từ 500.000đ</p>
        </div>
      </section>

      {/* Tại sao chọn chúng tôi */}
      <section className="why-us">
        <h2 className="section-title">Tại sao chọn chúng tôi</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <h3>Chất lượng cao</h3>
            <p>100% hàng chính hãng, cam kết bảo hành</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Giao hàng nhanh</h3>
            <p>Miễn phí vận chuyển toàn quốc</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💳</div>
            <h3>Thanh toán đa dạng</h3>
            <p>COD, chuyển khoản, ví điện tử</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔄</div>
            <h3>Đổi trả dễ dàng</h3>
            <p>Đổi trả trong 7 ngày nếu không hài lòng</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
