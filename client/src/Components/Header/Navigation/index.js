import React, { useEffect, useState } from "react";
import "./Navigation.css";
import { FaBars } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import {
  apiGetAllSubCategories,
  apiGetCategories,
  apiGetSubCategories,
} from "../../../services";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    // Hàm gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const response = await apiGetCategories();
        console.log(response);
        setCategories(response.response.data); // Giả sử dữ liệu trả về là mảng danh mục
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Hàm gọi API để lấy danh mục con
    const fetchSubCategories = async () => {
      try {
        const response2 = await apiGetAllSubCategories();
        console.log(response2);

        setSubCategories(response2.data.response); // Giả sử dữ liệu trả về là mảng danh mục con
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <div className="hnc-header-bottom d-none d-lg-block">
      <div className="container">
        <div className="row ktl-header-bottom-inner">
          <div className="col-lg-3">
            <div className="header-categories-nav position-relative">
              <span className="menu-opener">
                <FaBars />
                &nbsp; Danh Mục Sản Phẩm &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <IoIosArrowDown className="icon-arrow" />
              </span>
              <div className="categories-menu-dropdown">
                <ul className="menu">
                  {categories.map((category) => (
                    <li className="menu-item" key={category.id}>
                      <Link to={`/product/category/${category.id}`}>
                        {category.name}
                      </Link>
                      <ul className="sub-menu-dropdown">
                        {subCategories
                          .filter(
                            (subCat) => subCat.category_id === category.id
                          )
                          .map((subCat) => (
                            <li key={subCat.id}>
                              <Link to={`/listing/subcategory/${subCat.id}`}>
                                {subCat.subCat}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <nav className="main-navigation">
              <ul className="menu">              

                <li>
                  <a href="/gioi-thieu">Giới thiệu</a>
                </li>
                <li>
                  <a href="/san-pham">Sản phẩm</a>
                </li>
                <li>
                  <a href="/dich-vu">Dịch vụ</a>
                </li>
                <li>
                  <a href="/bai-viet">Bài viết</a>
                </li>
                <li>
                  <a href="/khuyen-mai">Khuyến mãi</a>
                </li>
                <li>
                  <a href="/lien-he">Liên hệ</a>
                </li>
                <li>
                  <a href="/hot" className="highlight">
                    HOT
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
