import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomeCat = ({ catData }) => {
  return (
    <section className="homeCat">
      <div className="container">
        <Swiper
          slidesPerView={12}
          spaceBetween={10}
          navigation={true}
          slidesPerGroup={4}
          modules={[Navigation]}
          className="mySwiper"
        >
          {catData?.length > 0 ? (
            catData.map((cat, index) => (
              <SwiperSlide key={index}>
                <div className="item_cat text-center cursor">
                  <div className="image-container">
                    <img src={cat?.images?.[0] || '/default-image.jpg'} className="guitar-icon" alt={cat.name} />
                  </div>
                  <h6>{cat.name}</h6>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCat;
