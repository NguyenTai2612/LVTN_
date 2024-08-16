import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import guitar from "../../assets/images/guitar.png";
import organ from "../../assets/images/organ.png";
import piano from "../../assets/images/piano.png"; 
import violin from "../../assets/images/violin.png"; 
import amplifi from "../../assets/images/amplifi.png"; 
import uklele from "../../assets/images/uklele.png"; 
import sao from "../../assets/images/sao.png"; 
import dan_toc from "../../assets/images/dan_toc.png"; 
import { fetchDataFromApi } from "../../utils/api";

const images = [
  { src: guitar, title: "Guitar" },
  { src: organ, title: "Organ" },
  { src: piano, title: "Piano" },
  { src: violin, title: "Violin" },
  { src: amplifi, title: "Amplifi" },
  { src: uklele, title: "Ukalele" },
  { src: sao, title: "Sáo" },
  { src: dan_toc, title: "Dân tộc" },
  // add more objects for other images
];

const HomeCat = (props) => {


  return (
    <section className="homeCat">
      <div className="container">
        <Swiper
          slidesPerView={10}
          spaceBetween={10}
          navigation={true}
          slidesPerGroup={4}
          modules={[Navigation]}
          className="mySwiper"
        >
          {props.catData?.categoryList?.length!==0 && props.catData?.categoryList?.map((cat, index) => (
            <SwiperSlide key={index}>
              <div className="item_cat text-center cursor">
                <div className="image-container">
                  <img src={cat.images[0]}  className="guitar-icon" />
                </div>
                <h6>{cat.name}</h6>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCat;
