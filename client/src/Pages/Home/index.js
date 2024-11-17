import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeCat from "../../Components/HomeCat/index.js";
import ProductItem from "../../Components/ProductItem";
import GuitarHeader from "../../Components/GuitarHeader";
import {
  apiGetProducts,
  apiGetProductDetails,
  apiGetAllProductDetails2,
} from "../../services/product.js";
import { apiGetCategories } from "../../services/category.js";
import * as actions from "../../store/actions/index.js";
import { MyContext } from "../../App.js";
import { apiGetAllSubCategories } from "../../services/subCategory.js";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [selectedCat, setSelectCat] = useState(1); // Default value is 1
  const [guitarProducts, setGuitarProducts] = useState([]);
  const [guitarProductsCat1, setGuitarProductsCat1] = useState([]); // New variable for category 1 products
  const [guitarProductsCat2, setGuitarProductsCat2] = useState([]); // New variable for category 1 products
  const [value, setValue] = useState(0);

  const [guitarSubCats, setGuitarSubCats] = useState([]);
  const [pianoSubCats, setPianoSubCats] = useState([]);
  // const [filteredSubCats, setFilteredSubCats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSubCategories = async () => {
      try {
        // Giả sử apiGetSubCategories() là hàm gọi API của bạn
        const response = await apiGetAllSubCategories();

        // Kiểm tra phản hồi
        console.log("API Response:", response);

        if (response.data?.err === 0 && Array.isArray(response.data.response)) {
          // Lọc subcategories cho guitar
          const guitarSubCats = response.data.response
            .filter((subCat) => subCat.category_id === 5)
            .slice(0, 4); // Giới hạn chỉ lấy tối đa 4 subcategories
          setGuitarSubCats(guitarSubCats);

          // Lọc subcategories cho piano
          const pianoSubCats = response.data.response
            .filter((subCat) => subCat.category_id === 2)
            .slice(0, 4); // Giới hạn chỉ lấy tối đa 4 subcategories
          setPianoSubCats(pianoSubCats);
        } else {
          console.warn("Invalid response:", response);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isLoggedIn) {
      dispatch(actions.getCurrent());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (currentData) {
      localStorage.setItem("user", JSON.stringify(currentData));
    }
  }, [currentData]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCategories = async () => {
      try {
        const response = await apiGetCategories();
        if (response?.err === 0) {
          setCategories(response.response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductsDetails = async () => {
      try {
        // Gọi API để lấy tất cả sản phẩm và chi tiết
        const response2 = await apiGetAllProductDetails2();
        console.log("setProducts", response2.response);

        if (response2?.err === 0) {
          const allProducts = response2.response.reduce((acc, category) => {
            // Gộp tất cả sản phẩm từ các category vào một mảng
            return [...acc, ...category.products];
          }, []);

          setProducts(allProducts); // Đặt lại tất cả sản phẩm vào state
          const productDetails = allProducts.reduce((acc, product) => {
            acc[product.id] = product; // Lưu thông tin chi tiết cho từng sản phẩm
            return acc;
          }, {});
          setProductDetails(productDetails);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductsDetails();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectCat(categories[0]?.id); // Ensure to set the default category based on the available categories
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCat) {
      const filteredGuitarProducts = products.filter(
        (product) => product.category_id === selectedCat
      );
      setGuitarProducts(filteredGuitarProducts);
    }
  }, [selectedCat, products]);

  useEffect(() => {
    // Filter products with category_id = 1
    const filteredGuitarProductsCat1 = products.filter(
      (product) => product.category_id === 5
    );
    setGuitarProductsCat1(filteredGuitarProductsCat1);
  }, [products]);

  useEffect(() => {
    // Filter products with category_id = 2
    const filteredGuitarProductsCat2 = products.filter(
      (product) => product.category_id === 2
    );
    setGuitarProductsCat2(filteredGuitarProductsCat2);
  }, [products]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const selectedCategory = categories[newValue]?.id;
    setSelectCat(selectedCategory);
  };

  return (
    <div>
      {/* <HomeCat catData={categories} /> */}

      <section className="homeProducts">
        <div className="container">
          <div className="guitar-header1 mt-3">
            <div className="row">
              <div className="col-md-3 logo">SẢN PHẨM NỔI BẬT</div>
              <div className="col-md-9 links">
                <div className="ml-5">
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="filterTabs"
                    TabIndicatorProps={{
                      style: { backgroundColor: "#FF6347" },
                    }}
                  >
                    {categories.length > 0 ? (
                      categories.map((item, index) => (
                        <Tab
                          key={index}
                          className="item"
                          label={item.name}
                          style={{
                            color: "#333",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            padding: "10px 20px",
                          }}
                        />
                      ))
                    ) : (
                      <Tab
                        className="item"
                        label="No Categories Available"
                        style={{
                          color: "#333",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          padding: "10px 20px",
                        }}
                      />
                    )}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          <div className="product_row w-100 mt-2 mb-5">
            <Swiper
              slidesPerView={5}
              spaceBetween={0}
              navigation={true}
              slidesPerGroup={3}
              modules={[Navigation]}
              className="mySwiper"
            >
              {guitarProducts.length > 0 &&
                guitarProducts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductItem item={productDetails[item.id]} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          <GuitarHeader
            logoText="AMPLIFIER"
            links={guitarSubCats.map((subCat) => ({
              text: subCat.subCat,
              href: `/listing/subcategory/${subCat.id}`,
            }))}
            viewAllText="Xem tất cả →"
            viewAllHref="#"
          />
          <div className="product_row w-100 mt-2 mb-5">
            <Swiper
              slidesPerView={5}
              spaceBetween={0}
              navigation={true}
              slidesPerGroup={3}
              modules={[Navigation]}
              className="mySwiper"
            >
              {guitarProductsCat1.length > 0 &&
                guitarProductsCat1.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductItem item={productDetails[item.id]} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          <GuitarHeader
            logoText="TRỐNG"
            links={pianoSubCats.map((subCat) => ({
              text: subCat.subCat,
              href: `/listing/subcategory/${subCat.id}`,
            }))}
            viewAllText="Xem tất cả →"
            viewAllHref="#"
          />

          <div className="product_row w-100 mt-2 mb-5">
            <Swiper
              slidesPerView={5}
              spaceBetween={0}
              navigation={true}
              slidesPerGroup={3}
              modules={[Navigation]}
              className="mySwiper"
            >
              {guitarProductsCat2.length > 0 &&
                guitarProductsCat2.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductItem item={productDetails[item.id]} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
