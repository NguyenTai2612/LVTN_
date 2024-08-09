import React, { useState } from "react";
import Button from "@mui/material/Button";

const QuantityBox = () => {
  const [quantity, setQuantity] = useState(1); // State to track quantity

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <div>
      <div className="quantity-selector d-flex align-items-center">
        <Button
          className="quantity-button"
          onClick={decreaseQuantity}
          sx={{ minWidth: "20px", height: "20px", padding: 0 }}
        >
          -
        </Button>
        <input
          type="text"
          value={quantity}
          readOnly
          className="quantity-input"
          style={{
            textAlign: "center",
            margin: "0 0px",
            border: "none",
            background: "transparent",
            width: "10px",
          }}
        />
        <Button
          className="quantity-button"
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
