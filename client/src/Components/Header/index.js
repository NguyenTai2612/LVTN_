import { Link } from "react-router-dom";

import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { Button } from "@mui/material";

const Header = () => {
  const context = useContext(MyContext);

  return (
    <div className="headerWrapper">
      <div className="header">
        <div className="container">
          <div className="logo">
            <img
              src="https://nhaccutiendat.vn/upload/images/logo/logo-tiendat.png"
              alt="Logo"
            />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm" />
            <button>
              <CiSearch />
            </button>
          </div>
          <div className="menu">
            <div className="cursor">
              <img
                src="https://nhaccutiendat.vn/upload/images/category_icon/Icon Header/Kho_hang.png"
                alt="Giới Thiệu"
              />
              <span>GIỚI THIỆU</span>
            </div>
            <div className="cursor">
              <img
                src="https://nhaccutiendat.vn/upload/images/category_icon/Icon Header/Showroom.png"
                alt="Showroom"
              />
              <span>SHOWROOM</span>
            </div>
            <div className="cursor">
              <img
                src="https://nhaccutiendat.vn/upload/images/category_icon/Icon Header/Khuyen_mai.png"
                alt="Khuyến Mãi"
              />
              <span>KHUYẾN MÃI</span>
            </div>
            <div className="cursor">
              <img
                src="https://nhaccutiendat.vn/upload/images/category_icon/Icon Header/Tin_tuc.png"
                alt="Tin Tức"
              />
              <span>TIN TỨC</span>
            </div>
          </div>
          <div className="part3">
            {context.isLogin !== true ? (
              <Link to={"/signIn"}><Button className="btn-white btn-round">Sign In</Button></Link>
            ) : (
              <FiUser style={{ fontSize: "30", cursor: "pointer" }} />
            )}

            <div className="cartTab">
              <div className="position-relative">
                <IoBagOutline style={{ fontSize: "30", cursor: "pointer" }} />
                <span className="count">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Navigation />   */}
    </div>
  );
};

export default Header;
