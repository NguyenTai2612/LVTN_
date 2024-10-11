import React from "react";
import {
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <h3>Cửa Hàng Nhạc Cụ</h3>
          <p>
            Cung cấp đa dạng các loại nhạc cụ và phụ kiện âm nhạc chất lượng từ
            các thương hiệu uy tín, phục vụ nhu cầu âm nhạc của bạn.
          </p>
          <p>
            <FaMapMarkerAlt /> Địa chỉ: 217 Đường 3/2, Quận Ninh Kiều, Cần Thơ
          </p>
          <p>
            <FaPhone /> Hotline: 0899 064 193
          </p>
          <p>
            <FaEnvelope /> Email: taib2017077@student.ctu.edu.vn
          </p>
        </div>
        <div className="footer-section">
          <h3>Danh Mục Sản Phẩm</h3>
          <p>Đàn Guitar</p>
          <p>Đàn Piano</p>
          <p>Đàn Organ</p>
          <p>Trống</p>
          <p>Phụ kiện âm nhạc</p>
        </div>
        <div className="footer-section">
          <h3>Chính Sách</h3>
          <p>Chính sách bảo hành</p>
          <p>Chính sách đổi trả</p>
          <p>Chính sách bảo mật</p>
          <p>Chính sách vận chuyển</p>
        </div>
        <div className="footer-section">
          <h3>Hỗ Trợ Khách Hàng</h3>
          <p>Hướng dẫn mua hàng</p>
          <p>Liên hệ hỗ trợ</p>
          <p>Thanh toán và giao nhận</p>
          <p>Câu hỏi thường gặp</p>
        </div>
        <div className="footer-section">
          <h3>Chấp Nhận Thanh Toán</h3>
          <p>
            <FaCcVisa size={24} /> <FaCcMastercard size={24} /> <FaCcPaypal size={24} />
          </p>
          <p>&copy; 2024 Cửa Hàng Nhạc Cụ</p>
          <div className="contact-icons">
            <a href="mailto:info@yourdomain.com">
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
