import React from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomeCat = ({ catData }) => {
  return (
    <div className="container">
      <section className="homeCat">
        <div className="auto">
          <Swiper
            slidesPerView={10}
            spaceBetween={5}
            navigation={true}
            slidesPerGroup={4}
            modules={[Navigation]}
            className={`mySwiper ${
              catData?.length <= 10 ? "centeredSwiper" : ""
            }`}
          >
            {catData?.length > 0 ? (
              catData.map((cat, index) => (
                <SwiperSlide key={index}>
                  <Link to={`/subCat/${cat?.id}`}>
                    <div className="item_cat text-center cursor">
                      <div className="image-container">
                        <img
                          src={
                            cat?.category?.images?.[0] || "/default-image.jpg"
                          }
                          className="guitar-icon"
                          alt={cat.name}
                        />
                      </div>
                      <h6>{cat?.subCat}</h6>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default HomeCat;
