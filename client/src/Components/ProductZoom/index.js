import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from "swiper/modules";

import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { useContext, useRef, useState } from "react";
import { MyContext } from "../../App";

const ProductZoom = () => {
    const [slideIndex, setSlideIndex] = useState(0); // State to track quantity
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();
  
    const context = useContext(MyContext);

    const goto = (index) => {
        setSlideIndex(index);
        zoomSlider.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
      };

  return (
    <div className="productZoom">
      <div className="productZoom position-relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          navigation={false}
          slidesPerGroup={1}
          modules={[Navigation]}
          className="zoomSliderBig"
          ref={zoomSliderBig}
        >
          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={`https://nhaccutiendat.vn/upload/img/dan-ukulele-valote-va-24m02_3062.jpg?width=1000&height=1000&quality=100`}
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={`https://nhaccutiendat.vn/upload/img/Dan-Ukulele-VALOTE-VA-24M02.jpg?width=1000&height=1000&quality=100`}
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={`https://nhaccutiendat.vn/upload/images/anhphusp/1457/Dan%20ukulele%20VALOTE%20VA-24M02-2.png?width=1000&height=1000&quality=100`}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={`https://nhaccutiendat.vn/upload/img/dan-ukulele-valote-va-24m02_3062.jpg?width=1000&height=1000&quality=100`}
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={`https://nhaccutiendat.vn/upload/img/Dan-Ukulele-VALOTE-VA-24M02.jpg?width=1000&height=1000&quality=100`}
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={`https://nhaccutiendat.vn/upload/images/anhphusp/1457/Dan%20ukulele%20VALOTE%20VA-24M02-2.png?width=1000&height=1000&quality=100`}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        navigation={true}
        slidesPerGroup={1}
        modules={[Navigation]}
        className="zoomSlider"
        ref={zoomSlider}
      >
        <SwiperSlide>
          <div className={`item ${slideIndex === 0 ? "item-active" : ""}`}>
            <img
              className="w-100"
              onClick={() => goto(0)}
              src={`https://nhaccutiendat.vn/upload/img/dan-ukulele-valote-va-24m02_3062.jpg?width=1000&height=1000&quality=100`}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className={`item ${slideIndex === 1 ? "item-active" : ""}`}>
            <img
              className="w-100"
              onClick={() => goto(1)}
              src={`https://nhaccutiendat.vn/upload/img/Dan-Ukulele-VALOTE-VA-24M02.jpg?width=1000&height=1000&quality=100`}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className={`item ${slideIndex === 2 ? "item-active" : ""}`}>
            <img
              className="w-100"
              onClick={() => goto(2)}
              src={`https://nhaccutiendat.vn/upload/images/anhphusp/1457/Dan%20ukulele%20VALOTE%20VA-24M02-2.png?width=1000&height=1000&quality=100`}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={`item ${slideIndex === 3 ? "item-active" : ""}`}>
            <img
              className="w-100"
              onClick={() => goto(3)}
              src={`https://nhaccutiendat.vn/upload/img/dan-ukulele-valote-va-24m02_3062.jpg?width=1000&height=1000&quality=100`}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className={`item ${slideIndex === 4 ? "item-active" : ""}`}>
            <img
              className="w-100"
              onClick={() => goto(4)}
              src={`https://nhaccutiendat.vn/upload/img/Dan-Ukulele-VALOTE-VA-24M02.jpg?width=1000&height=1000&quality=100`}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className={`item ${slideIndex === 5 ? "item-active" : ""}`}>
            <img
              className="w-100"
              onClick={() => goto(5)}
              src={`https://nhaccutiendat.vn/upload/images/anhphusp/1457/Dan%20ukulele%20VALOTE%20VA-24M02-2.png?width=1000&height=1000&quality=100`}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProductZoom;
