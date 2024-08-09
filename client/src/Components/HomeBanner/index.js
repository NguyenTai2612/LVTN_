import React from "react";
import Slider from "react-slick";

const PageBottomRightBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  const images = [
    "https://vietthuong.vn/image/catalog/Baner/2024/back-to-school-vtm-2024-vn.png",
    "https://vietthuong.vn/image/catalog/Baner/2023/samdanfender-ldp-t03.jpg",
    "https://vietthuong.vn/image/catalog/Baner/2023/km-tang-voucher-hoc-nhac-vt.png",
    "https://theme.hstatic.net/200000423875/1001138926/14/slide_2_img.jpg?v=679",
  ];

  return (
    <div className="pageBottomRightBannerSection">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="item">
            <img src={src} alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PageBottomRightBanner;
