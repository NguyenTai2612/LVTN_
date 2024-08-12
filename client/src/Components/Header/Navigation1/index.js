import React, { useState } from "react";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import HomeBanner from "../../HomeBanner/index.js";

const Navigation = () => {
  const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(true);

  const categories = [
    // { name: "Giảm giá mỗi tuần", path: "/" },
    { name: "Đàn Piano", path: "/" },
    { name: "Đàn Organ", path: "/" },
    { name: "Đàn Guitar", path: "/" },
    { name: "Đàn Violin", path: "/" },
    { name: "Trống - Amplifier", path: "/" },
    { name: "Đàn Ukulele", path: "/" },
    { name: "Kèn - Sáo - Tiêu", path: "/" },
    { name: "Nhạc cụ Dân tộc", path: "/" },
    // { name: "Phụ kiện nhạc cụ", path: "/" }
  ];

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-3 navPart1 mt-1">
            <div className="catWrapper">
              <Button className="allCatTab align-items-center" onClick={() => setIsOpenSidebarNav(!isOpenSidebarNav)}>
                <span className="icon1 mr-2">
                  <IoIosMenu />
                </span>
                <span className="text mt-1">Danh mục sản phẩm</span>
                <span className="icon2 ml-2">
                  <FaAngleDown />
                </span>
              </Button>
              <div className={`sidebarNav ${isOpenSidebarNav ? 'open' : ''}`}>
                <ul>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link to={category.path}>
                        <Button>
                          {category.name} <FaAngleRight className="ml-auto" />
                        </Button>
                      </Link>
                      <div className="submenu">
                        {/* Submenu items */}
                        <Link to={"/"}><Button>clothing</Button></Link>
                        <Link to={"/"}><Button>footwear</Button></Link>
                        <Link to={"/"}><Button>watches</Button></Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-9 navPart2 mt-1">
            <HomeBanner />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
