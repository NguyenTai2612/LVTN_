import React from "react";
import {
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaEnvelope,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <h3>Nhạc Cụ Tiến Đạt</h3>
          <p>
            Hơn 20 năm kinh nghiệm phân phối Đàn Organ, đàn Guitar, đàn Piano,
            đàn Ukulele, trống cơ, trống điện, nhạc cụ Giáo dục, phụ kiện các
            hãng Yamaha, Casio, Roland, Kawai, Fender, Valote, Martin, Taylor
            ...
          </p>
          <p>
            <FaMapMarkerAlt /> Showroom tại Hà Nội: Số 85 Nguyễn Văn Huyên, Phường Quan Hoa, Cầu Giấy
          </p>
          <p>
            <FaMapMarkerAlt /> Showroom tại Tp Hồ Chí Minh: 118 Điện Biên Phủ, Phường 17, Q. Bình Thạnh
          </p>
          <p>
            <FaPhone /> Phía Bắc: <br />
            Kinh doanh bán lẻ: 098.117.4788 - 090.321.6609 - 024.6663.9953 <br />
            Kinh doanh bán sỉ: 0904.82.1381
          </p>
          <p>
            <FaPhone /> Phía Nam: <br />
            Kinh doanh bán lẻ: 028.3505.0345 - 0938.770.002 - 0909.015.886 <br />
            Kinh doanh bán sỉ: 0904.831.381
          </p>
          <p>
            <FaGlobe /> https://nhaccutiendat.vn
          </p>
          <p>
            <FaEnvelope /> info@nhaccutiendat.vn
          </p>
        </div>
        <div className="footer-section">
          <h3>Danh Mục Sản Phẩm</h3>
          <p>Đàn Organ giá rẻ</p>
          <p>Đàn Organ Yamaha</p>
          <p>Đàn Piano</p>
          <p>Đàn Piano điện Yamaha</p>
          <p>Đàn Piano Kawai</p>
          <p>Đàn Piano Roland</p>
          <p>Đàn Piano Casio</p>
          <p>Guitar điện</p>
          <p>Bao đàn Guitar</p>
          <p>Kèn</p>
        </div>
        <div className="footer-section">
          <h3>Chính Sách</h3>
          <p>Chính sách và quy định chung</p>
          <p>Chính sách bán hàng và chất lượng h.hoá</p>
          <p>Chính sách bảo mật thông tin</p>
          <p>Chính sách Đổi - Trả hàng hoá</p>
          <p>Chính sách vận chuyển, giao nhận h.hoá</p>
          <p>Chính sách Bảo hành sản phẩm</p>
          <p>Chính sách Hỗ trợ trả góp</p>
        </div>
        <div className="footer-section">
          <h3>Trợ Giúp Nhanh</h3>
          <p>Kiếu nại & bồi thường</p>
          <p>Hướng dẫn thanh toán</p>
          <p>Hướng dẫn mua hàng</p>
          <p>Liên hệ với chúng tôi</p>
        </div>
        <div className="footer-section">
          <h3>Thông Tin Nhạc Cụ Tiến Đạt</h3>
          <p>Giới thiệu doanh nghiệp</p>
          <p>Hệ thống Showroom</p>
          <p>Hệ thống kho hàng</p>
          <p>Chứng nhận</p>
          <p>Tuyển dụng</p>
        </div>
        <div className="footer-section">
          <h3>Chấp Nhận Thanh Toán</h3>
          <p>
            <FaCcVisa size={24} /> <FaCcMastercard size={24} /> <FaCcPaypal size={24} />
          </p>
          <p>&copy; 2024 @ Nhạc cụ Tiến Đạt</p>
          <div className="contact-icons">
            <a href="mailto:info@nhaccutiendat.vn">
              <FaEnvelope size={24} color="white" />
            </a>
            <a href="#">
              <FaFacebook size={24} color="white" />
            </a>
            <a href="#">
              <FaYoutube size={24} color="white" />
            </a>
            <a href="#">
              <FaTiktok size={24} color="white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
