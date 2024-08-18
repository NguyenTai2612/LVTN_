import HomeBanner from "../../Components/HomeBanner";
import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api.js";
import ProductItem from "../../Components/ProductItem";
import GuitarHeader from "../../Components/GuitarHeader";
import HomeCat from "../../Components/HomeCat";
import { Button } from "@mui/material";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Navigation1 from "../../Components/Header/Navigation1";
import Tabs from "@mui/material/Tabs";
import { MyContext } from "../../App.js";
import Tab from "@mui/material/Tab";

const Home = () => {
  const [catData, setCatData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [fluteData, setFluteData] = useState([]);
  const [selectedCat, setSelectCat] = useState("Giảm giá");
  const [filterData, setFilterData] = useState([]);

  const [value, setValue] = React.useState(0);
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

  useEffect(() => {
    window.scrollTo(0, 0);

    setSelectCat(context.categoryData[0]?.name);
    if (context.categoryData.length !== 0) 

    // fetchDataFromApi("/api/category/").then((res) => {
    //   setCatData(res);
    // });

    // fetchDataFromApi(`/api/products/featured`).then((res) => {
    //   setFeaturedProducts(res);
    // });

    fetchDataFromApi("/api/products?perPage=8").then((res) => {
      setProductsData(res);
    });
  }, []);

  useEffect(() => {
    console.log(context.activeCat);

    fetchDataFromApi(`/api/products?catName=${selectedCat}`).then((res) => {
      setFilterData(res.products);

      // console.log(selectedCat);
    });
  }, [selectedCat]);

  const selectCat = (cat) => {
    setSelectCat(cat);
  };

  return (
    <div>

      {/* <HomeCat /> */}
      {context.subCategoryData?.length !== 0 && <HomeCat catData={context.subCategoryData} />}

      <Navigation1 />
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
              {/* <GuitarHeader
                logoText="SẢN PHẨM NỔI BẬT"
                links={organLinks}
                viewAllText="Xem tất cả →"
                viewAllHref="#"
              /> */}
              <div className="guitar-header">
                <div className="logo">SẢN PHẨM NỔI BẬT</div>

                <div className="links">
                  <div className="ml-auto">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      className="filterTabs"
                    >
                      {context.categoryData?.map((item, index) => {
                        return (
                          <Tab
                            className="item"
                            label={item.name}
                            onClick={() => selectCat(item?.name)}
                          />
                        );
                      })}
                    </Tabs>
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
                  {filterData?.length !== 0 &&
                    filterData?.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <ProductItem item={item} />
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
              <div className="product_grid">
                {productsData?.products?.length !== 0 &&
                  productsData?.products?.map((item, index) => {
                    return (
                      <div className="product_item_2_row ">
                        {" "}
                        <ProductItem key={index} item={item} />
                      </div>
                    );
                  })}
              </div>
            </div>
            <GuitarHeader
              logoText="SẢN PHẨM NỔI BẬT"
              links={guitarLinks}
              viewAllText="Xem tất cả →"
              viewAllHref="#"
            />

            <div className="product_row w-100 mt-2 mb-5">
              <div className="product_grid">
                {productsData?.products?.length !== 0 &&
                  productsData?.products?.map((item, index) => {
                    return (
                      <div className="product_item">
                        {" "}
                        <ProductItem key={index} item={item} />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
