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
import { useNavigate, useParams } from "react-router-dom";
import { BsChevronDoubleRight } from "react-icons/bs";
import {
  apiGetProductsBySubCat,
  apiGetCategoryById,
  apiGetSubCategoryById,
  apiGetProductsByCat,
  apiGetProductsByCatFilter,
  getCategoryBySubCategoryId, // Import API call for fetching products by category
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id } = useParams(); // Nhận cả id và type từ URL (type có thể là "category" hoặc "subcategory")
  const [productData, setProductData] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        if (type === "category") {
          const categoryResponse = await apiGetCategoryById(id);
          setCategoryData(categoryResponse.response);
          setShowSubCat(false);
          const productResponse = await apiGetProductsByCat(id);
          setProductData(productResponse.data.data);
        } else if (type === "subcategory") {
          const subCategoryResponse = await apiGetSubCategoryById(id);
          setSubCatData(subCategoryResponse.response);
          const parentCategoryResponse = await getCategoryBySubCategoryId(id);
          setParentCategory(parentCategoryResponse.response);
          setShowSubCat(true);
          const productResponse = await apiGetProductsBySubCat(id);
          setProductData(productResponse.data.data);
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [id, type]);
  

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setIsLoading(true);
  //       let productResponse;

  //       if (type === "category") {
  //         productResponse = await apiGetProductsByCat(id);
  //       } else if (type === "subcategory") {
  //         productResponse = await apiGetProductsBySubCat(id);
  //       }

  //       setProductData(productResponse.data.data);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [id, type]);

  const fetchProducts1 = async (subCatId, filters) => {
    try {
      const response = await apiGetProductsBySubCat(subCatId);
      let filteredProducts = response.data.data;
  
      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(
          product =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );
      }
  
      if (filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          filters.brands.includes(product.brand)
        );
      }
  
      if (filters.rating) {
        filteredProducts = filteredProducts.filter(
          product => Math.floor(product.rating) === filters.rating
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
          <div className="productListing d-flex">
          <SideBar
              filterData={handleFilterData} // Pass filterData handler to Sidebar
              categoryId={
                type === "category" ? categoryData?.id : parentCategory?.id
              }
            />

            <div className="content-right">
              <div className="showBy mt-2 mb-3 d-flex align-items-center">
                <div>
                  <h5>
                    <span className="category-container">
                      {type === "category" && categoryData && (
                        <>
                          <button className="category-button" onClick={handleHomeClick}>
                            <span className="home">
                              {" "}
                              <FaHome />
                            </span>
                            Home
                          </button>

                          <BsChevronDoubleRight className="chevron-icon" />
                          <button
                            className="category-button"
                            onClick={() => handleCategoryClick(categoryData.id)}
                          >
                            {categoryData.name}
                          </button>
                        </>
                      )}
                      {type === "subcategory" && parentCategory && (
                        <>
                          <button className="category-button">
                            <span className="home">
                              {" "}
                              <FaHome />
                            </span>
                            Home
                          </button>

                          <BsChevronDoubleRight className="chevron-icon" />
                          <button
                            className="category-button"
                            onClick={() =>
                              handleCategoryClick(parentCategory.id)
                            }
                          >
                            {parentCategory.name}
                          </button>
                          <BsChevronDoubleRight className="chevron-icon" />
                          <button className="category-button">
                            {subCatData.subCat}
                          </button>
                        </>
                      )}
                    </span>
                  </h5>
                </div>

                <div className="d-flex align-items-center ml-auto btnWrapper">
                  <Button
                    className={productView === "one" && "act"}
                    onClick={() => setProductView("one")}
                  >
                    <IoIosMenu />
                  </Button>
                  <Button
                    className={productView === "three" && "act"}
                    onClick={() => setProductView("three")}
                  >
                    <CgMenuGridR />
                  </Button>
                  <Button
                    className={productView === "four" && "act"}
                    onClick={() => setProductView("four")}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>
              </div>

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
