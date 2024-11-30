import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductItem from "../../Components/ProductItem";

function App() {
  const [image, setImage] = useState(null); // Lưu ảnh được chọn
  const [similarProducts, setSimilarProducts] = useState([]); // Lưu danh sách sản phẩm tương tự
  const [error, setError] = useState(null); // Lưu thông báo lỗi
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading

  // Hàm xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Hàm gửi yêu cầu tìm kiếm sản phẩm từ ảnh
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload an image.");
      return;
    }

    setError(null); // Reset lỗi
    setLoading(true); // Bật hiệu ứng loading
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/search-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Kiểm tra dữ liệu trả về và hiển thị kết quả
      if (response.status === 200) {
        const similarProductIds = response.data.similarProducts.map(
          (product) => product.product_id
        );

        // Truy vấn thông tin chi tiết của các sản phẩm
        const productDetails = await fetchProductDetails(similarProductIds);
        setSimilarProducts(productDetails);
      } else {
        setError("Failed to fetch similar products.");
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError("An error occurred while searching for similar products.");
    } finally {
      setLoading(false); // Tắt hiệu ứng loading sau khi nhận được phản hồi từ API
    }
  };

  // Hàm lấy chi tiết sản phẩm dựa trên danh sách product_ids
  const fetchProductDetails = async (productIds) => {
    try {
      const responses = await Promise.all(
        productIds.map((id) =>
          axios.get(`http://localhost:5000/api/v1/product/${id}/details`)
        )
      );
      return responses.map((response) => response.data.response); // Trả về danh sách sản phẩm chi tiết
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Có lỗi xảy ra khi tải thông tin sản phẩm.");
      return [];
    }
  };

  // Sử dụng useEffect để in giá trị của similarProducts khi nó thay đổi
  useEffect(() => {
    if (similarProducts.length > 0) {
      console.log("Updated similar products:", similarProducts);
    }
  }, [similarProducts]); // Chạy khi similarProducts thay đổi

  return (
    <div className="cartPage">
      <div className="container pt-3">
        <h1>Tìm kiếm sản phẩm theo hình ảnh</h1>

        {/* Form để tải ảnh lên */}
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            id="image-upload"
          />
          
          {/* Hiển thị ảnh tải lên nếu có */}
          {image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded Preview"
                style={{ width: "200px", height: "auto", marginTop: "10px" }}
              />
            </div>
          )}

          {/* Nút submit với hiệu ứng loading */}
          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span> // Có thể thay bằng Spinner library như Material-UI, Bootstrap, hoặc CSS
            ) : (
              "Search"
            )}
          </button>
        </form>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Hiển thị kết quả tìm kiếm sản phẩm tương tự */}
        {similarProducts.length > 0 && (
          <div>
            <h2>Sản phẩm tương tự</h2>
            <div className="productListing">
              {similarProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  item={product}
                  itemView="four" // Hoặc tùy chỉnh kiểu hiển thị
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
