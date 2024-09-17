import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiSavePaymentInfo } from "../../services/order";
import { deleteAllCartByUserId } from "../../services/cart";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSuccess = async () => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const orderId = localStorage.getItem("orderId");
      const amount = localStorage.getItem("amount");

      if (orderId) {
        try {
          // Cập nhật thông tin thanh toán
          const paymentData = {
            order_id: orderId,
            paymentMethod: "Chuyển khoản ngân hàng",
            paymentStatus: "Đã thanh toán",
            amount: amount, // Bạn có thể cần điều chỉnh số tiền nếu cần
            paymentDate: new Date(),
          };
          await apiSavePaymentInfo(paymentData);
   

          // Xóa giỏ hàng của người dùng
          await deleteAllCartByUserId(userId);

          // Xóa orderId từ localStorage
          localStorage.removeItem("orderId");
          localStorage.removeItem("amount");

          // Điều hướng đến trang đơn hàng thành công
          navigate("/orders");
        } catch (error) {
          console.error("Lỗi khi cập nhật thông tin thanh toán:", error);
        }
      }
    };

    handleSuccess();
  }, [navigate]);

  return <div>Thanh toán thành công! Đang xử lý đơn hàng...</div>;
};

export default SuccessPage;
