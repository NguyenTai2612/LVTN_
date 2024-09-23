import React, { useEffect, useState } from "react";
import SideBar from "../../Components/Sidebar";
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import ProductItem from "../../Components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoChevronForwardOutline } from "react-icons/io5";
import {
  apiGetProductsBySubCat,
  apiGetCategoryById,
  apiGetSubCategoryById,
  apiGetProductsByCat,
  apiGetProductsByCatFilter,
  getCategoryBySubCategoryId,
  apiGetChildSubCategoryById,
  apiGetCategoryByChildSubCatId,
  apiGetProductsByChildSubCategory, // Import API call for fetching products by category
} from "../../services";
import { FaHome } from "react-icons/fa";

const Listing = ({ type }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState("four");
  const [categoryData, setCategoryData] = useState(null);
  const [subCatData, setSubCatData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubCat, setShowSubCat] = useState(true); // New state to control the visibility of subCatData.subCat
  const openDropDown = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [products, setProducts] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [childSubCatData, setChildSubCatData] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id } = useParams(); // Nhận cả id và type từ URL (type có thể là "category" hoặc "subcategory")
  const [productData, setProductData] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (type === "category") {
          window.scrollTo(0, 0);

          const categoryResponse = await apiGetCategoryById(id);
          setCategoryData(categoryResponse.response);
          setShowSubCat(false);
          const productResponse = await apiGetProductsByCat(id);
          setProductData(productResponse.data.data);
        } else if (type === "subcategory") {
          window.scrollTo(0, 0);

          const subCategoryResponse = await apiGetSubCategoryById(id);
          setSubCatData(subCategoryResponse.response);
          const parentCategoryResponse = await getCategoryBySubCategoryId(id);
          setParentCategory(parentCategoryResponse.response);
          setShowSubCat(true);
          const productResponse = await apiGetProductsBySubCat(id);
          setProductData(productResponse.data.data);
        } else if (type === "childsubcategory") {
          window.scrollTo(0, 0);

          const childSubCategoryResponse = await apiGetChildSubCategoryById(id); // Gọi API này
          setChildSubCatData(childSubCategoryResponse.response); // Thiết lập childSubCatData
          const parentCategoryResponse = await apiGetCategoryByChildSubCatId(
            id
          ); // API lấy danh mục cha
          setParentCategory(parentCategoryResponse.response);
          setShowSubCat(true);
          const productResponse = await apiGetProductsByChildSubCategory(id); // Gọi API này
          setProductData(productResponse.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  const fetchProducts1 = async (subCatId, filters) => {
    try {
      const response = await apiGetProductsBySubCat(subCatId);
      let filteredProducts = response.data.data;

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );
      }

      if (filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          filters.brands.includes(product.brand)
        );
      }

      if (filters.rating) {
        filteredProducts = filteredProducts.filter(
          (product) => Math.floor(product.rating) === filters.rating
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục phụ:", error);
    }
  };

  // Handle filter change from Sidebar
  const handleFilterData = (subCatId, filters) => {
    fetchProducts1(subCatId, filters); // Fetch products by selected subcategory and apply filters
  };

  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/product/category/${categoryId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleHomeClick = () => {
    navigate("/"); // Đường dẫn tới trang Home
  };

  return (
    <div>
      <section className="product_Listing_Page">
        <div className="container">
          <nav className="woocommerce-breadcrumb" aria-label="Breadcrumb">
            <ul className="breadcrumb-list">
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <span className="breadcrumb-separator">›</span>
              </li>
              {type === "category" && categoryData && (
                <>
                  <li>
                    <button
                      className="category-button"
                      onClick={() => handleCategoryClick(categoryData.id)}
                    >
                      {categoryData.name}
                    </button>
                  </li>
                </>
              )}
              {type === "subcategory" && parentCategory && (
                <>
                  <li>
                    <span
                      className="category-button"
                      onClick={() => handleCategoryClick(parentCategory.id)}
                    >
                      {parentCategory.name}
                    </span>
                  </li>
                  <li>
                    <span className="breadcrumb-separator">›</span>
                  </li>
                  {subCatData?.subCat && (
                    <li>
                      <span className="category-button">
                        {subCatData.subCat}
                      </span>
                    </li>
                  )}
                </>
              )}
              {type === "childsubcategory" &&
                parentCategory &&
                subCatData &&
                childSubCatData && (
                  <>
                    <li>
                      <span
                        className="category-button"
                        onClick={() => handleCategoryClick(parentCategory.id)}
                      >
                        {parentCategory.name}
                      </span>
                    </li>
                    <li>
                      <span className="breadcrumb-separator">›</span>
                    </li>
                    <li>
                      <span
                        className="category-button"
                        onClick={() => handleCategoryClick(subCatData.id)}
                      >
                        {subCatData.subCat}
                      </span>
                    </li>
                    <li>
                      <span className="breadcrumb-separator">›</span>
                    </li>
                    <li>
                      <span className="category-button">
                        {childSubCatData.name}
                      </span>
                    </li>
                  </>
                )}
            </ul>
            <div class="custom-divider"></div>
          </nav>

          <div class="card mb-3">
            <div class="card-body">
              <header class="woocommerce-products-header">
                <div class="title-woo">
                  <div class="title-inner">
                    <h1 class="woocommerce-products-header__title page-title m-0 p-0 text-transform-uppercase font-weight-bold">
                      {type === "category" && categoryData?.name}
                      {type === "subcategory" && subCatData?.subCat}
                      {type === "childsubcategory" && childSubCatData?.name}
                    </h1>

                    <div class="show-and-sort">
                      <div class="woocommerce-notices-wrapper"></div>
                      <form class="woocommerce-ordering" method="get">
                        <select
                          name="orderby"
                          class="orderby form-select"
                          aria-label="Đơn hàng của cửa hàng"
                        >
                          <option value="popularity">
                            Thứ tự theo mức độ phổ biến
                          </option>
                          <option value="rating">
                            Thứ tự theo điểm đánh giá
                          </option>
                          <option value="date">Mới nhất</option>
                          <option value="price" selected="selected">
                            Thứ tự theo giá: thấp đến cao
                          </option>
                          <option value="price-desc">
                            Thứ tự theo giá: cao xuống thấp
                          </option>
                        </select>
                        {/* <input type="hidden" name="paged" value="1"> */}
                      </form>
                    </div>
                  </div>
                  <p class="woocommerce-result-count">
                    Hiển thị 1–20 của 164 kết quả
                  </p>
                </div>
              </header>
            </div>
          </div>

          <div className="productListing d-flex">
            <SideBar
              filterData={handleFilterData} // Pass filterData handler to Sidebar
              categoryId={
                type === "category" ? categoryData?.id : parentCategory?.id
              }
            />

            <div className="content-right">
              <div className="productListing">
                {isLoading ? (
                  <p>Loading...</p>
                ) : productData.length > 0 ? (
                  productData.map((item, index) => (
                    <ProductItem
                      key={index}
                      itemView={productView}
                      item={item}
                    />
                  ))
                ) : (
                  <p>Không có sản phẩm nào.</p>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination count={10} color="primary" size="large" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Listing;
