import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "../ProductItem/index"; // Import component ProductItem
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [productView, setProductView] = useState("four"); // Mặc định là "four"

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/search-product?name=${query}`
        );
        setProducts(response.data);
        console.log('setProducts',response.data)
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Có lỗi xảy ra khi tải sản phẩm.");
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  return (
    <>
      <section className="productDetails section">
        <div className="container">
          <div>
            <h2>Kết quả tìm kiếm cho: "{query}"</h2>
            {isLoading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="product-list">
                {products.length > 0 ? (
                  <div className="productListing">
                    {products.map((product) => (
                      <ProductItem
                        key={product.id}
                        itemView={productView} // Truyền giá trị mặc định là "four"
                        item={product}
                      />
                    ))}
                  </div>
                ) : (
                  <p>Không có sản phẩm nào phù hợp.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
