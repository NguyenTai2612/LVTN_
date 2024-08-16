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
          <span className="badge bg-success text-white mr-3">
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
            </div>

            <div className="d-flex align-items-center mt-2">
              <div className="d-flex align-items-center mr-4">
                <span className="badge bg-success text-white mr-3">
                  IN STOCK
                </span>
              </div>
            </div>

            <div className="price">
              <span className="current-price"><Price amount={props?.data?.price} /></span>
              <span className="original-price"><Price amount={props?.data?.oldPrice} /></span>
              <span className="discount font-weight-bold">-{props?.data?.discount} %</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <QuantityBox />
              &nbsp;
              &nbsp;
              &nbsp;
              &nbsp;
              <Button className="btn-add-to-cart mr-auto">
             
                <FaCartPlus /> &nbsp; Add to Cart
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
