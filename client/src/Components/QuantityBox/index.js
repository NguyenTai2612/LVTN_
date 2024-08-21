import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

const QuantityBox = (props) => {
  const [quantity, setQuantity] = useState(1); // State to track quantity

  useEffect(()=>{
    if(props?.value!==undefined && props?.value!==null && props?.value!=="" ){
      setQuantity(parseInt(props?.value))
    }
  },[props.value])
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };



  useEffect(()=>{
    props?.quantity(quantity)
    props?.selectedItem(props.item, quantity)
  },[quantity])

  // useEffect(()=>{
  //   if(props?.selectedQty!==undefined &&props?.selectedQty!==null) {
  //     setQuantity(props?.selectedQty)
  //   }
  // },[props.selectedQty])
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
            width: "10px",
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
