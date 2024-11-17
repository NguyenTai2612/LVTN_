import React from "react";

const Gift = () => {
  return (
    <div className="gift-info">
      <h3>Quà tặng</h3>
      <ul>
        <li>Tặng kèm bao đàn, phím, capo, ty chỉnh cần hoặc không lấy quà tặng giảm <strong>150.000 VNĐ</strong></li>
        <li>Hỗ trợ giảm <strong>15%</strong> giá phụ kiện (Dây đàn giảm 5%)</li>
        <li>Bảo hành Chính hãng 12 tháng.</li>
        <li>Free vận chuyển các quận nội thành TP Cần Thơ bán kính 10km.</li>
        <li>Có áp dụng chính sách lỗi kỹ thuật 1 đổi 1 trong 3 ngày.</li>
        <li>Phát hiện hàng giả <strong>bồi thường 200%</strong></li>
        {/* <li>Mua trả góp 3, 6, 9, 12 tháng</li> */}
      </ul>
      <div className="gift-image">
        <img src="https://nhaccutiendat.vn/upload/images/banner/quatang_guitar_yamaha.jpg" alt="Gift Icon" />
      </div>
    </div>
  );
};

export default Gift;
