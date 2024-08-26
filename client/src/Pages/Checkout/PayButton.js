import { Button } from "@mui/material";
import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { postData } from "../../utils/api";
import axios from "axios";

const PayButton = ({ cartItems }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const handleCheckout = () => {
    axios
      .post(`http://localhost:4000/api/stripe/create-checkout-session`, {
        cartItems,
        userId: user?.userid,
      })
      .then((res) => {
        if (res && res.data && res.data.url) {
          window.location.href = res.data.url;
        } else {
          console.error("No URL found in the response");
        }
      })
      .catch((err) => {
        console.error("Error during checkout:", err.message);
      });
  };


  return (
    <div>
      <div className="confirm">
        <Button
          type="submit"
          className="btn-red btn-lg btn-big mt-4"
          onClick={() => handleCheckout()}
        >
          Đặt hàng
        </Button>
      </div>
    </div>
  );
};

export default PayButton;