import React, { useEffect } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import Navigation from "./Navigation"; // Import component Navigation
import Logo from "../../assets/images/logo.jpg";
import "./Header.css";
import { Avatar, Button } from "@mui/material";
import { MyContext } from "../../App";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaFileCircleCheck } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import { useSelector, useDispatch } from "react-redux";
import * as action from "../../store/actions";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const context = useContext(MyContext);
  const open = Boolean(anchorEl);
  const history = useNavigate();

  const { cartData } = useContext(MyContext);
  const cartCount = cartData.length;

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigation = useNavigate()

  useEffect(() => {
    // Bạn có thể thêm logic tùy chỉnh ở đây nếu cần
  }, [cartData]);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="row align-items-center">
            {/* Desktop Logo */}
            <div className="col-lg-3 d-none d-lg-block">
              <a href="/" className="custom-logo-link">
                <img
                  src={Logo}
                  alt="Logo Nhạc Cụ Tiến Mạnh"
                  className="custom-logo"
                />
              </a>
            </div>

            {/* Mobile Logo */}
            <div className="col-6 col-lg-5 d-block d-lg-none text-left">
              <a href="/" className="custom-logo-link">
                <img
                  src="/path/to/logo-mobile.png"
                  alt="Logo Nhạc Cụ Tiến Mạnh"
                  className="custom-logo"
                />
              </a>
            </div>

            {/* Search Bar */}
            <div className="col-lg-4">
              <form className="search-form" method="get" action="/">
                <div className="search-wrap">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm…"
                    name="s"
                    id="search-input"
                  />
                  <button type="submit" id="search-submit">
                    <FaSearch />
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information & Cart */}
            <div className="col-lg-5 d-none d-lg-flex justify-content-between align-items-center">
              <div className="header-contact">
                <div className="contact-item">
                  <div className="contact-line">
                    <FaPhone className="header-icon" />
                    <span>HOTLINE: 0943 683 790</span>
                  </div>
                  <div className="contact-line">
                    <FaMapMarkerAlt className="header-icon" />
                    <span>301 Hoàng Văn Thụ, P.2, Tân Bình, HCM</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="part3">
                    {isLoggedIn !== true ? (
                      <Button
                        className="btn-white btn-round"
                        onClick={()=>{navigation("/signIn")}}
                        style={{
                          width: "100px", // Adjust the width to your desired size
                          padding: "10px 20px", // Optional: adjust padding
                        }}
                      >
                        Đăng nhập
                      </Button>
                    ) : (
                      <>
                        <Button
                          style={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: "#000",
                            transition: "color 0.3s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#007bff")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "#000")
                          }
                          onClick={handleClick}
                        >
                          <FiUser style={{ marginTop: "2" }} />
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          id="account-menu"
                          open={open}
                          onClose={handleClose}
                          onClick={handleClose}
                          transformOrigin={{
                            horizontal: "left",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "left",
                            vertical: "bottom",
                          }}
                        >
                          <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                              <FaUser style={{ fontSize: "20" }} />
                            </ListItemIcon>
                            Thông tin cá nhân
                          </MenuItem>

                          <Divider />
                          <Link to={"/orders"}>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <FaFileCircleCheck style={{ fontSize: "20" }} />
                              </ListItemIcon>
                              Đơn hàng
                            </MenuItem>
                          </Link>
                          {/* <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                              <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                          </MenuItem> */}
                          <MenuItem onClick={() => dispatch(action.logout())}>
                            <ListItemIcon>
                              <MdLogout style={{ fontSize: "20" }} />
                            </ListItemIcon>
                            Thoát
                          </MenuItem>
                        </Menu>
                      </>
                    )}

                    <div className="cartTab">
                      <div className="position-relative">
                        <a href="/cart">
                          <HiOutlineShoppingCart
                            style={{ fontSize: "30", cursor: "pointer" }}
                          />
                        </a>
                        <span className="count text-white">{cartCount}</span>
                        <span className=" text-black">
                          {/* {context.cartData?.length !== 0 && (
                            <Price
                              amount={context.cartData
                                ?.map(
                                  (item) => parseInt(item.price) * item.quantity
                                )
                                .reduce((total, value) => total + value, 0)}
                              className="your-custom-classname" // Replace with your actual class name if needed
                            />
                          )} */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Icons */}
            <div className="col-6 col-lg-5 d-block d-lg-none text-right">
              <FaBars className="mobile-nav-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Import the Navigation component */}
      <Navigation />
    </header>
  );
};

export default Header;
