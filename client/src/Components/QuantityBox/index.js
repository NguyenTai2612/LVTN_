import React, { useState } from "react";
import Button from "@mui/material/Button";

const QuantityBox = ({ item, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1); // Ensure default value is 1

  // Function to increase quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      if (onQuantityChange) {
        onQuantityChange(newQuantity); // Notify parent with updated quantity
      }
      return newQuantity;
    });
  };

  // Function to decrease quantity
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity > 1 ? prevQuantity - 1 : 1;
      if (onQuantityChange) {
        onQuantityChange(newQuantity); // Notify parent with updated quantity
      }
      return newQuantity;
    });
  };

  return (
    <div>
      <div className="quantity-selector d-flex align-items-center">
        <Button
          className="quantity-button font-weight-bold"
          onClick={decreaseQuantity}
          sx={{ minWidth: "20px", height: "20px", padding: 0 }}
          aria-label="Decrease quantity"
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
          aria-label="Quantity"
        />
        <Button
          className="quantity-button font-weight-bold"
          onClick={increaseQuantity}
          sx={{ minWidth: "20px", height: "20px", padding: 0 }}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default QuantityBox;
