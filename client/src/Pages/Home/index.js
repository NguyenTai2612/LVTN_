import HomeBanner from "../../Components/HomeBanner";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import Navigation from "../../Components/Header/Navigation";

import ProductItem from "../../Components/ProductItem";
import GuitarHeader from "../../Components/GuitarHeader";
import HomeCat from "../../Components/HomeCat";

const Home = () => {
  // const guitarLinks = [
  //   { text: "Guitar Takamine", href: "#" },
  //   { text: "Guitar Valote", href: "#" },
  //   { text: "Guitar Yamaha", href: "#" },
  //   { text: "Guitar Taylor", href: "#" },
  // ];

  const organLinks = [
    { text: "Organ Casio", href: "#" },
    { text: "Organ Yamaha", href: "#" },
    { text: "Organ Roland", href: "#" },
  ];

  return (
    <div>
    <Navigation />  

      <div className="pageBottomRightBannerContainer">
        <HomeBanner />
      </div>

      <HomeCat />

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
                logoText="Giảm giá mỗi tuần "
                links={[]}
                viewAllText="Xem tất cả →"
                viewAllHref="#"
              />

              <div className="product_grid">
                {[...Array(4)].map((_, index) => (
                  <div className="product_item" key={index}>
                    <ProductItem />
                  </div>
                ))}
              </div>

              <GuitarHeader
                logoText="ĐÀN ORGAN"
                links={organLinks}
                viewAllText="Xem tất cả →"
                viewAllHref="#"
              />

              <div className="product_grid">
                {[...Array(8)].map((_, index) => (
                  <div className="product_item" key={index}>
                    <ProductItem />
                  </div>
                ))}
              </div>
{/* 
              <GuitarHeader
                logoText="ĐÀN GUITAR"
                links={guitarLinks}
                viewAllText="Xem tất cả →"
                viewAllHref="#"
              /> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
