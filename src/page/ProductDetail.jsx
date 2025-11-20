import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/css/style.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Lấy thông tin sản phẩm
      const { data: productData, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(productData);

      // Lấy sản phẩm liên quan (cùng danh mục)
      if (productData) {
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category", productData.category)
          .neq("id", id)
          .limit(4);
        setRelatedProducts(related || []);
      }
    } catch (error) {
      console.error("Lỗi:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (product.stock === 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!product) {
    return (
      <div className="not-found">
        <h3>Không tìm thấy sản phẩm!</h3>
        <button onClick={() => navigate("/san-pham")}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="product-detail">
        <div className="product-image-section">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-info-section">
          <span className="category-badge">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="brand">Thương hiệu: {product.brand}</p>

          <div className="rating-section">
            <span className="stars">⭐ {product.rating_rate}</span>
            <span className="count">({product.rating_count} đánh giá)</span>
          </div>

          <div className="price-section">
            <span className="price">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className="product-specs">
            <div className="spec-item">
              <strong>Chất liệu:</strong> {product.material}
            </div>
            <div className="spec-item">
              <strong>Tình trạng:</strong>{" "}
              {product.stock > 0 ? (
                <span className="in-stock">Còn hàng ({product.stock})</span>
              ) : (
                <span className="out-stock">Hết hàng</span>
              )}
            </div>
          </div>

          <div className="description">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description}</p>
          </div>

          {product.stock > 0 && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Số lượng:</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  +
                </button>
              </div>

              <button className="add-to-cart-button" onClick={addToCart}>
                🛒 Thêm vào giỏ hàng
              </button>
              <button
                className="buy-now-button"
                onClick={() => {
                  addToCart();
                  navigate("/gio-hang");
                }}
              >
                Mua ngay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Sản phẩm liên quan</h2>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="product-card"
                onClick={() => navigate(`/san-pham/${p.id}`)}
              >
                <div className="product-image">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="product-info">
                  <h4>{p.title}</h4>
                  <p className="brand">{p.brand}</p>
                  <div className="rating">
                    <span>⭐ {p.rating_rate}</span>
                  </div>
                  <p className="price">{p.price.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
