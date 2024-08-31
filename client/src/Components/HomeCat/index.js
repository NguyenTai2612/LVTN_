import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetCategories } from "../../services/category";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomeCat = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiGetCategories();
      if (response?.data.err === 0) {
        setCategories(response.data.response);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="container">
      <section className="homeCat">
        <div className="auto">
          <Swiper
            slidesPerView={10}
            spaceBetween={122}
            navigation={true}
            slidesPerGroup={4}
            modules={[Navigation]}
            className={`mySwiper`}
          >
            {categories?.length !== 0 ? (
              categories?.map((cat, index) => (
                <SwiperSlide key={index}>
                  <Link
                    to={`products/category/${cat?.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="item_cat text-center cursor">
                      <div className="image-container">
                        <img
                          src={cat?.image || "/default-image.jpg"}
                          className="guitar-icon"
                          alt={cat?.name}
                        />
                      </div>
                      <h6>{cat?.name}</h6>
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
