import HomeBanner from "../../Components/HomeBanner";
import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api.js";
import ProductItem from "../../Components/ProductItem";
import GuitarHeader from "../../Components/GuitarHeader";
import { Button } from "@mui/material";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Tabs from "@mui/material/Tabs";
import { MyContext } from "../../App.js";
import Tab from "@mui/material/Tab";
import HomeCat from "../../Components/HomeCat/index.js";
import {
  apiGetProducts,
  apiGetProductDetails,
} from "../../services/product.js";
import { apiGetCategories } from "../../services/category.js";
import { useDispatch, useSelector } from "react-redux";
import { apiGetCurrent } from "../../services/user.js";
import * as actions from "../../store/actions/index.js";

const Home = () => {
  const [catData, setCatData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [fluteData, setFluteData] = useState([]);
  const [selectedCat, setSelectCat] = useState("AMPLIFIER");
  const [filterData, setFilterData] = useState([]);
  const [guitarProducts, setGuitarProducts] = useState([]);

  const [value, setValue] = React.useState(0);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [categories, setCategories] = useState([]);
  const context = useContext(MyContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const guitarLinks = [
    { text: "Guitar Takamine", href: "#" },
    { text: "Guitar Valote", href: "#" },
    { text: "Guitar Yamaha", href: "#" },
    { text: "Guitar Taylor", href: "#" },
  ];

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);

  useEffect(() => {
    setTimeout(() => {
      isLoggedIn && dispatch(actions.getCurrent());
    }, 1000);
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentData) {
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(currentData));
    }
  }, [currentData]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiGetProducts();
      if (response?.data.err === 0) {
        setProducts(response.data.response);
        // Fetch details for all products
        const detailsPromises = response.data.response.map((product) =>
          apiGetProductDetails(product.id)
        );
        Promise.all(detailsPromises).then((results) => {
          const details = {};
          results.forEach((result) => {
            if (result.data.err === 0) {
              details[result.data.response.id] = result.data.response;
            }
          });
          setProductDetails(details);
        });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch products for the category "Đàn Guitar"
    // fetchDataFromApi(`/api/products?catName=Đàn Guitar`).then((res) => {
    //   setGuitarProducts(res.products);
    // });
  }, []);

  useEffect(() => {
    fetchDataFromApi(`/api/products?catName=${selectedCat}`).then((res) => {
      setFilterData(res.products);
    });
  }, [selectedCat]);

  const selectCat = (cat) => {
    setSelectCat(cat);
  };

  useEffect(() => {
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

  
  return (
    <div>
     <HomeCat catData={categories} />

      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="banner">
                <img
                  src="https://nhaccutiendat.vn/upload/images/category_banner/poster_category/sale2.jpg"
                  className="cursor w-100"
                  style={{ marginTop: 0 }}
                />
                <img
                  src="https://nhaccutiendat.vn/upload/images/category_banner/poster_category/dan_guitar2_danhmuc.jpg"
                  className="cursor w-100 mt-4"
                  style={{ marginTop: 0 }}
                />

                <div className="banner mt-4">
                  <img
                    src="https://nhaccutiendat.vn/upload/images/category_banner/poster_category/dan_organ_danhmuc.jpg"
                    className="cursor w-100"
                    style={{ marginTop: 28 }}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-9 productRow">
              <div className="guitar-header">
                <div className="row">
                  <div className="col-md-3 logo">SẢN PHẨM NỔI BẬT</div>
                  <div className="col-md-9 links">
                    <div className="ml-auto">
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
                              onClick={() => selectCat(item.name)}
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
                  slidesPerView={4}
                  spaceBetween={0}
                  navigation={true}
                  slidesPerGroup={3}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {products?.length !== 0 &&
                    products?.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <ProductItem item={productDetails[item.id]} />
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>

              <GuitarHeader
                logoText="ĐÀN GUITAR"
                links={guitarLinks}
                viewAllText="Xem tất cả →"
                viewAllHref="#"
              />
              <div className="product_row w-100 mt-2 mb-5">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={0}
                  navigation={true}
                  slidesPerGroup={3}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {guitarProducts?.length !== 0 &&
                    guitarProducts?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <ProductItem item={productDetails[item.id]} />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
