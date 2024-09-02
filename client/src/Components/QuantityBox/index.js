import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const QuantityBox = ({ item, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1); // Đảm bảo giá trị mặc định là 1

  // Hàm tăng số lượng
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  useEffect(() => {
    if (onQuantityChange) {
      onQuantityChange(quantity); // Chỉ gửi quantity
    }
  }, [quantity, onQuantityChange]);

  return (
    <div>
      <div className="quantity-selector d-flex align-items-center">
        <Button
          className="quantity-button font-weight-bold"
          onClick={decreaseQuantity}
          sx={{ minWidth: "20px", height: "20px", padding: 0 }}
        >
          -
        </Button>
        <input
          type="text"
          value={quantity}
          readOnly
          className="quantity-input font-weight-bold"
          style={{
            textAlign: "center",
            margin: "0 0px",
            border: "none",
            background: "transparent",
            width: "40px",
          }}
        />
        <Button
          className="quantity-button font-weight-bold"
          onClick={increaseQuantity}
          sx={{ minWidth: "20px", height: "20px", padding: 0 }}
        >
          +
        </Button>
      </div>
    </div>
  );
};


export default QuantityBox;
//edittttttt