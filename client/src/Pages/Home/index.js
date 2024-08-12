import HomeBanner from "../../Components/HomeBanner";
import React, { useEffect, useState } from "react";
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

const Home = () => {
  const [catData, setCatData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/category/").then((res) => {
      setCatData(res);
    });

    fetchDataFromApi(`/api/products/featured`).then((res) => {
      setFeaturedProducts(res);
    });
  }, []);

  fetchDataFromApi("/api/products/").then((res) => {
    setProductsData(res);
  });

  const guitarLinks = [
    { text: "Guitar Takamine", href: "#" },
    { text: "Guitar Valote", href: "#" },
    { text: "Guitar Yamaha", href: "#" },
    { text: "Guitar Taylor", href: "#" },
  ];

  const organLinks = [
    // { text: "Organ Casio", href: "#" },
    // { text: "Organ Yamaha", href: "#" },
    // { text: "Organ Roland", href: "#" },
  ];

  return (
    <div>
      <Navigation1 />

      {/* <HomeCat /> */}
      {catData?.length !== 0 && <HomeCat catData={catData} />}
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
              <GuitarHeader
                logoText="SẢN PHẨM NỔI BẬT"
                links={organLinks}
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
                  {featuredProducts?.length !== 0 &&
                    featuredProducts?.map((item, index) => {
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
                      <div className="product_item">
                        {" "}
                        <ProductItem key={index} item={item} />
                      </div>
                    );
                  })}
              </div>
            </div>
            <GuitarHeader
              logoText="SẢN PHẨM NỔI BẬT"
              links={organLinks}
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
