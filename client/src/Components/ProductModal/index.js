import React, { useState, useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import { Rating } from "@mui/material";

import { MyContext } from "../../App";

import ProductZoom from "../ProductZoom";
import QuantityBox from "../QuantityBox";
import Button from "@mui/material/Button";
import { FaCartPlus } from "react-icons/fa";
import Price from "../Price";

const ProductModal = (props) => {
  const context = useContext(MyContext);
  const specifications = props?.data?.specifications || {};
  return (
    <Dialog
      className="productModal"
      open={context.isOpenProductModal}
      onClose={() => context.setIsOpenProductModal(false)}
    >
      <Button
        onClick={() => context.setIsOpenProductModal(false)}
        className="close_"
      >
        <MdClose />
      </Button>

      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4 font-weight-bold">
          <span>Thương Hiệu: &nbsp;</span>
          <span className="badge1 bg-blue text-white mr-3">
            {props?.data?.brand}
          </span>
        </div>
      </div>

      <div className="row mt-2 productDetailsModal">
        <div className="col-md-5">
          <ProductZoom images={props?.data?.images} />
        </div>

        <div className="col-md-7">
          <div className="product-details">
            <h1>{props?.data?.name}</h1>
            <div className="rating-review">
              <Rating
                name="read-only"
                value={parseInt(props?.data?.rating)}
                readOnly
                size="small"
                precision={0.5}
              />
              <span className="cursor">1 Review</span>
              <div
                className="d-flex align-items-center mt-1"
                style={{ marginLeft: "17px" }}
              >
                <div className="d-flex align-items-center mr-4">
                  <span className="badge bg-success text-white mr-3">
                    IN STOCK
                  </span>
                </div>
              </div>
            </div>

            <div className="product-price mt-3 mr-2">
              <Price amount={props?.data?.price} />
            </div>
            <div className="d-flex align-items-center">
              <span className="mb-3"> Giá gốc:</span>
              <span className="original-price font-weight-bold ml-4">
                <div style={{ marginLeft: "9px" }}>
                  <Price amount={props?.data?.oldPrice} />
                </div>
              </span>
              <span className="discount mr-auto">
                -{props?.data?.discount} %
              </span>
            </div>

            <div className="warranty ">
              <span>Bảo hành:</span>
              <span className="font-weight-bold ml-5">12 Tháng</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <QuantityBox />
              &nbsp; &nbsp; &nbsp; &nbsp;
              <Button className="btn-add-to-cart mr-auto">
                <FaCartPlus /> &nbsp; Thêm vào giỏ hàng
              </Button>
            </div>
            <div className="details-table">
              <h6 className="font-bold mb-3">THÔNG SỐ KỸ THUẬT</h6>
              <table>
                <tbody>
                  {Object.entries(specifications).map(([key, value], index) => (
                    <tr key={index}>
                      <th>{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;
