// ContactPage.js
import React from 'react';
import { FaCalendarAlt, FaSyncAlt, FaUserTag, FaUser, FaPhone, FaEnvelope, FaParagraph } from 'react-icons/fa';


const ContactPage = () => {
  return (
    <div className="container page-content">
      <div className='cartPage'>
          <h1 className="page-title">Liên hệ</h1>
          <div className="post-meta hnc-post-meta">
            <span className="post-date">
              <span className="published-time">
                <FaCalendarAlt /> <time dateTime="2019-07-16">16/07/2019</time>
              </span>
            </span>
            <span className="post-date">
              <span className="last-updated-time">
                <FaSyncAlt /> <time dateTime="2019-10-08">08/10/2019</time>
              </span>
            </span>
            <span className="post-author">
              <FaUserTag /> Nhạc Cụ Tài Instrument
            </span>
          </div>
    
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="info-company">
                <p><strong>Nhạc Cụ Tài Instrument</strong></p>
                <p><strong>HOTLINE:</strong> 0899 064 193</p>
                <p>- Địa chỉ: 217 Đường 3/2, Quận Ninh Kiều, Cần Thơ</p>
                <p><strong>Email:</strong> taib2017077@student.ctu.edu.vn</p>
                <p><strong>Ngành nghề kinh doanh:</strong></p>
                <p>– Sản xuất và mua bán nhạc cụ các loại;</p>
                <p>– Sản xuất, mua bán thiết bị âm thanh, ánh sáng;</p>
                <p>– Xuất nhập khẩu các mặt hàng công ty kinh doanh.</p>
              </div>
            </div>
    
            <div className="col-12 col-md-6">
              <p>Đội ngũ nhân viên chăm sóc khách hàng luôn sẵn lòng hỗ trợ giải đáp thắc mắc. Vui lòng điền thông tin dưới đây và chúng tôi sẽ liên hệ lại trong 24 giờ tới. Xin cám ơn!</p>
              <form action="/submit-contact" method="post" className="contact-form" noValidate>
                <div className="input-group mb-1">
                  <div className="input-group-prepend">
                    <div className="input-group-text"><FaUser /></div>
                  </div>
                  <input type="text" name="name" className="form-control" placeholder="Tên của bạn *" required />
                </div>
    
                <div className="input-group mb-1">
                  <div className="input-group-prepend">
                    <div className="input-group-text"><FaPhone /></div>
                  </div>
                  <input type="tel" name="phone" className="form-control" placeholder="Điện thoại *" required />
                </div>
    
                <div className="input-group mb-1">
                  <div className="input-group-prepend">
                    <div className="input-group-text"><FaEnvelope /></div>
                  </div>
                  <input type="email" name="email" className="form-control" placeholder="Email (nếu có)" />
                </div>
    
                <div className="input-group mb-1">
                  <div className="input-group-prepend">
                    <div className="input-group-text"><FaParagraph /></div>
                  </div>
                  <input type="text" name="subject" className="form-control" placeholder="Tiêu đề *" required />
                </div>
    
                <div className="input-group mb-1">
                  <textarea name="message" className="form-control" rows="5" placeholder="Nội dung *" required></textarea>
                </div>
    
                <button type="submit" className="btn btn-primary mt-2 w-100">GỬI ĐI</button>
              </form>
            </div>
          </div>
    
          <div className="map-company mt-4">
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62193.50653330953!2d105.7540322710353!3d10.0299337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0880f16fa7e9d%3A0xdf1c73a5a38bb3a7!2zMjE3IMSQxrDhu51uZyAzLzIsIFBoxrDhu51uZyA5LCBRdeG6rW4gTmluaCBLaeG7gSwgQ8OibiBUaMaw4bubYg!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              title="Company Location"
            ></iframe>
          </div>
      </div>
    </div>
  );
};

export default ContactPage;
