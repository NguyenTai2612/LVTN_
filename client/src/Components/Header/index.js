import React, { useEffect, useContext } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import Navigation from "./Navigation";
import Logo from "../../assets/images/logo.jpg";
import "./Header.css";
import { Avatar, Button } from "@mui/material";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaFileCircleCheck } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { useSelector, useDispatch } from "react-redux";
import * as action from "../../store/actions";
import SearchBar from "./SearchBar";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const context = useContext(MyContext);
  const open = Boolean(anchorEl);
  const history = useNavigate();
  const { cartData } = useContext(MyContext);
  const cartCount = cartData.length;
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-3">
              <a href="/" className="custom-logo-link">
                <img
                  src={Logo}
                  alt="Logo Nhạc Cụ Tiến Mạnh"
                  className="custom-logo"
                />
              </a>
            </div>

            {/* Tìm kiếm */}
            <div className="col-lg-5">
              <SearchBar />
            </div>

            {/* Thông tin liên hệ và giỏ hàng */}
            <div className="col-lg-4 d-flex justify-content-end align-items-center">
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
                <div className="contact-item d-flex align-items-center">
                  {isLoggedIn ? (
                    <>
                      <Button
                        onClick={handleClick}
                        style={{ fontSize: "30px", cursor: "pointer" }}
                      >
                        <FiUser />
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <FiUser style={{ fontSize: "20" }} />
                          </ListItemIcon>
                          Thông tin cá nhân
                        </MenuItem>
                        <Divider />
                        <Link to="/orders">
                          <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                              <FaFileCircleCheck style={{ fontSize: "20" }} />
                            </ListItemIcon>
                            Đơn hàng
                          </MenuItem>
                        </Link>
                        <MenuItem onClick={() => dispatch(action.logout())}>
                          <ListItemIcon>
                            <MdLogout style={{ fontSize: "20" }} />
                          </ListItemIcon>
                          Thoát
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Button
                      className="btn-white btn-round"
                      onClick={() => history("/signIn")}
                    >
                      Đăng nhập
                    </Button>
                  )}
                  <div className="cartTab position-relative">
                    <Link to="/cart">
                      <HiOutlineShoppingCart style={{ fontSize: "30" }} />
                    </Link>
                    <span className="count text-white">{cartCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
