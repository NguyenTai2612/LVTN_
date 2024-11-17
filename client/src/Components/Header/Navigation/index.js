// src/components/Navigation.js
import React, { useEffect, useState } from "react";
import "./Navigation.css";
import { FaBars } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  apiGetCategories,
  apiGetAllSubCategories,
  apiGetAllChildSubCategories,
} from "../../../services/index";

const Navigation = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childSubCategories, setChildSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          categoriesResponse,
          subCategoriesResponse,
          childSubCategoriesResponse,
        ] = await Promise.all([
          apiGetCategories(),
          apiGetAllSubCategories(),
          apiGetAllChildSubCategories(),
        ]);

        setCategories(categoriesResponse.response.data);
        setSubCategories(subCategoriesResponse.data.response);
        setChildSubCategories(childSubCategoriesResponse.response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="hnc-header-bottom d-none d-lg-block">
      <div className="container">
        <div className="row ktl-header-bottom-inner">
          <div className="col-lg-3">
            <div className="header-categories-nav position-relative dropdown-navigation">
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
                          .filter(subCat => subCat.category_id === category.id)
                          .map(subCat => (
                            <li key={subCat.id}>
                              <Link to={`/listing/subcategory/${subCat.id}`}>
                                {subCat.subCat}
                              </Link>
                              <ul className="child-sub-menu-dropdown">
                                {childSubCategories
                                  .filter(childSubCat => childSubCat.sub_category_id === subCat.id)
                                  .map(childSubCat => (
                                    <li key={childSubCat.id}>
                                      <Link to={`/listing/childsubcategory/${childSubCat.id}`}>
                                        {childSubCat.name}
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
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
                <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
                <li><Link to="http://localhost:3000/product/category/1">Sản phẩm</Link></li>
                {/* <li><Link to="/dich-vu">Dịch vụ</Link></li> */}
                <li className="menu-item">
                  <Link to="http://localhost:3000/bai-viet-ve-dan-piano">Bài viết</Link>
                  <ul className="sub-menu-dropdown">
                    <li><Link to="/bai-viet-ve-dan-piano">Bài viết về đàn Piano</Link></li>
                    <li><Link to="/bai-viet-ve-dan-violin">Bài viết về đàn Violin</Link></li>
                    <li><Link to="/bai-viet-ve-bo-trong">Bài viết về Bộ Trống</Link></li>
                    <li><Link to="/bai-viet-ve-dan-kalimba">Bài viết đàn Kalimba</Link></li>
                    <li><Link to="/bai-viet-ve-dan-bau">Bài viết đàn Bầu</Link></li>
                    <li><Link to="/bai-viet-ve-dan-tranh">Bài viết đàn Tranh</Link></li>
                    <li><Link to="/bai-viet-ve-dan-ukulele">Bài viết đàn Ukulele</Link></li>
                    <li><Link to="/bai-viet-ve-phu-kien">Bài viết Phụ kiện</Link></li>
                    <li><Link to="/hoat-dong-tien-manh-music">Hoạt động</Link></li>
                  </ul>
                </li>
                {/* <li><Link to="/khuyen-mai">Khuyến mãi</Link></li> */}
                <li><Link to="/lien-he">Liên hệ</Link></li>
                {/* <li><Link to="/hot" className="highlight">HOT</Link></li> */}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
