import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/style.css";

const AdminEditProduct = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    title: "",
    category: "",
    price: "",
    image: "",
    description: "",
    stock: 0,
    brand: "",
    material: "",
    rating_rate: 0,
    rating_count: 0,
  });

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchProduct();
    }
  }, [id, isNew]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setProduct(data || {});
    } catch (error) {
      alert("Lỗi khi tải sản phẩm: " + error.message);
      navigate("/admin/products");
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!product.title || !product.category || !product.price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (isNew) {
        const { error } = await supabase.from("products").insert([product]);
        if (error) throw error;
        alert("✅ Đã thêm sản phẩm mới!");
      } else {
        const { error } = await supabase
          .from("products")
          .update(product)
          .eq("id", id);
        if (error) throw error;
        alert("✅ Đã cập nhật sản phẩm!");
      }
      navigate("/admin/products");
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="form-header">
        <h1>{isNew ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/products")}
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label>
              Tên sản phẩm <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              required
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="form-group">
            <label>
              Danh mục <span className="required">*</span>
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Giá (VNĐ) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Thương hiệu</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Nhập tên thương hiệu"
            />
          </div>

          <div className="form-group">
            <label>Chất liệu</label>
            <input
              type="text"
              name="material"
              value={product.material}
              onChange={handleChange}
              placeholder="Ví dụ: Da bò thật"
            />
          </div>

          <div className="form-group">
            <label>Số lượng tồn kho</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Đánh giá (0-5)</label>
            <input
              type="number"
              name="rating_rate"
              value={product.rating_rate}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
            />
          </div>

          <div className="form-group">
            <label>Số lượt đánh giá</label>
            <input
              type="number"
              name="rating_count"
              value={product.rating_count}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>URL Hình ảnh</label>
          <input
            type="url"
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {product.image && (
            <div className="image-preview">
              <img src={product.image} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group full-width">
          <label>Mô tả sản phẩm</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="5"
            placeholder="Nhập mô tả chi tiết về sản phẩm..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
          <button type="submit" className="btn btn-primary">
            {isNew ? "Thêm sản phẩm" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
