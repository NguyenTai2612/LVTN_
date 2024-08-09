import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../../../Components/ProductItem";
import GuitarHeader from "../../../Components/GuitarHeader";

const RelatedProduct = (props) => {
  return (
    <div className=" mb-4">
      <div className="d-flex align-items-center ">
        <GuitarHeader
          logoText={props.title}
          links={[]}
          viewAllText="Xem tất cả →"
          viewAllHref="#"
        />
      </div>
      <div className="">
        <div className="w-100 mt-2">
          <Swiper
            slidesPerView={6}
            spaceBetween={10}
            navigation={true}
            slidesPerGroup={3}
            modules={[Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div><ProductItem /></div>
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide>
              <ProductItem />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default RelatedProduct;
