import React from "react";
import "./Navigation.css";
import { FaBars } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdHome } from "react-icons/io";

const Navigation = () => {
  return (
    <div className="hnc-header-bottom d-none d-lg-block">
      <div className="container">
        <div className="row ktl-header-bottom-inner">
          <div className="col-lg-3">
            <div className="header-categories-nav position-relative">
              <span className="menu-opener">
                <FaBars />&nbsp;
                Danh Mục Sản Phẩm &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <IoIosArrowDown className="icon-arrow" />
              </span>         
              <div className="categories-menu-dropdown">
                <ul className="menu">
                  <li className="menu-item">
                    <a href="#">
                      <img
                        src="https://nhaccutienmanh.vn/wp-content/themes/nhaccutienmanh/images/icon-cat/027-piano.svg"
                        className="category-icon"
                        alt="Icon Đàn Piano"
                      />
                      Đàn Piano
                    </a>
                    <ul className="sub-menu-dropdown">
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-dien/">Đàn Piano Điện</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-co/">Đàn Piano Cơ</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-cuon/">Đàn Piano Cuộn</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-dien-cu/">Đàn Piano Điện Cũ</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-co-cu/">Đàn Piano Cơ Cũ</a></li>
                      <li><a href="https://nhaccutienmanh.vn/phu-kien-cho-dan-piano/">Phụ Kiện Cho Đàn Piano</a></li>
                    </ul>
                  </li>
                  <li className="menu-item">
                    <a href="https://nhaccutienmanh.vn/dan-organ/">
                      <img
                        src="https://nhaccutienmanh.vn/wp-content/themes/nhaccutienmanh/images/icon-cat/034-organ.svg"
                        className="category-icon"
                        alt="Icon Đàn Organ"
                      />
                      Đàn Organ
                    </a>
                    <ul className="sub-menu-dropdown">
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-korg/">Đàn Organ Korg</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-yamaha/">Đàn Organ Yamaha</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-casio/">Đàn Organ Casio</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-roland/">Đàn Organ Roland</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-kurtzman/">Đàn Organ Kurtzman</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-synthesizer-chuyen-nghiep/">Đàn Synthesizer Chuyên nghiệp</a></li>
                      <li><a href="https://nhaccutienmanh.vn/phu-kien-cho-dan-organ/">Phụ Kiện Cho Đàn Organ</a></li>
                    </ul>
                  </li>
                  <li className="menu-item">
                    <a href="https://nhaccutienmanh.vn/dan-piano/">
                      <img
                        src="https://nhaccutienmanh.vn/wp-content/themes/nhaccutienmanh/images/icon-cat/027-piano.svg"
                        className="category-icon"
                        alt="Icon Đàn Piano"
                      />
                      Đàn Piano
                    </a>
                    <ul className="sub-menu-dropdown">
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-dien/">Đàn Piano Điện</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-co/">Đàn Piano Cơ</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-cuon/">Đàn Piano Cuộn</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-dien-cu/">Đàn Piano Điện Cũ</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-piano-co-cu/">Đàn Piano Cơ Cũ</a></li>
                      <li><a href="https://nhaccutienmanh.vn/phu-kien-cho-dan-piano/">Phụ Kiện Cho Đàn Piano</a></li>
                    </ul>
                  </li>
                  <li className="menu-item">
                    <a href="https://nhaccutienmanh.vn/dan-organ/">
                      <img
                        src="https://nhaccutienmanh.vn/wp-content/themes/nhaccutienmanh/images/icon-cat/034-organ.svg"
                        className="category-icon"
                        alt="Icon Đàn Organ"
                      />
                      Đàn Organ
                    </a>
                    <ul className="sub-menu-dropdown">
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-korg/">Đàn Organ Korg</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-yamaha/">Đàn Organ Yamaha</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-casio/">Đàn Organ Casio</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-roland/">Đàn Organ Roland</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-organ-kurtzman/">Đàn Organ Kurtzman</a></li>
                      <li><a href="https://nhaccutienmanh.vn/dan-synthesizer-chuyen-nghiep/">Đàn Synthesizer Chuyên nghiệp</a></li>
                      <li><a href="https://nhaccutienmanh.vn/phu-kien-cho-dan-organ/">Phụ Kiện Cho Đàn Organ</a></li>
                    </ul>
                  </li>
                  {/* Add more menu items as needed */}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <nav className="main-navigation">
              <ul className="menu">
              <li><a href="/"><IoMdHome style={{fontSize:"19"}}/></a></li>
                
                <li><a href="/gioi-thieu">Giới thiệu</a></li>
                <li><a href="/san-pham">Sản phẩm</a></li>
                <li><a href="/dich-vu">Dịch vụ</a></li>
                <li><a href="/bai-viet">Bài viết</a></li>
                <li><a href="/khuyen-mai">Khuyến mãi</a></li>
                <li><a href="/lien-he">Liên hệ</a></li>
                <li><a href="/hot" className="highlight">HOT</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
