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
import { useParams } from "react-router-dom";
import { BsChevronDoubleRight } from "react-icons/bs";
import {
  apiGetProductsBySubCat,
  apiGetCategoryById,
  apiGetSubCategoryById,
  apiGetProductsByCat,
  apiGetProductsByCatFilter, // Import API call for fetching products by category
} from "../../services";

const Listing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState("four");
  const [productData, setProductData] = useState([]);
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

  const { id: subCatId } = useParams(); // Lấy subCatId từ URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Fetch products by subCategory ID
        const productResponse = await apiGetProductsBySubCat(subCatId);
        setProductData(productResponse.data.data);

        // Fetch subCategory details
        const subCatResponse = await apiGetSubCategoryById(subCatId);
        setSubCatData(subCatResponse.response);

        // Fetch category details
        const categoryResponse = await apiGetCategoryById(
          subCatResponse.response.category_id
        );
        setCategoryData(categoryResponse.response);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchProducts(); // Gọi hàm fetchProducts khi subCatId thay đổi
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang load
  }, [subCatId]);

  const fetchProducts1 = async (subCatId, filters) => {
    try {
      const response = await apiGetProductsByCatFilter(subCatId, filters);
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFilterData = (subCatId, filters) => {
    fetchProducts1(subCatId, filters);
  };

  useEffect(() => {
    // Fetch initial subCategoryData and other initial data
    // setSubCategoryData(data);
  }, []);

  // New function to handle click on category
  const handleCategoryClick = async (categoryId) => {
    try {
      setIsLoading(true);
      // Fetch products by category ID
      const productResponse = await apiGetProductsByCat(categoryId);
      setProductData(productResponse.data.data);

      // Hide subCatData
      setShowSubCat(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section className="product_Listing_Page">
        <div className="container">
          <div className="productListing d-flex">
            <SideBar
              filterData={handleFilterData} subCategoryData={subCategoryData}
            />

            <div className="content-right">
              <div className="showBy mt-2 mb-3 d-flex align-items-center">
                <div>
                  <h5>
                    <span class="category-container">
                      <button
                        class="category-button"
                        onClick={() => handleCategoryClick(categoryData?.id)}
                      >
                        {categoryData ? categoryData.name : "Loading..."}
                      </button>
                      <BsChevronDoubleRight className="chevron-icon" />
                      <button
                        class="category-button"
                        onClick={() => handleCategoryClick()}
                      >
                        {showSubCat &&
                          (subCatData ? subCatData.subCat : "Loading...")}
                      </button>
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
                {productData?.map((item, index) => (
                  <ProductItem key={index} itemView={productView} item={item} />
                ))}
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
