import React, { useState, useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import { Rating } from "@mui/material";

import { MyContext } from "../../App";

import ProductZoom from "../ProductZoom";
import QuantityBox from "../QuantityBox";
import Button from "@mui/material/Button";
import { FaCartPlus } from "react-icons/fa";


const ProductModal = (props) => {
  const context = useContext(MyContext);

  return (
    <Dialog
      className="productModal"
      onClose={() => context.setIsOpenProductModal(false)}
      open={context.setIsOpenProductModal}
    >
      <Button
        onClick={() => context.setIsOpenProductModal(false)}
        className="close_"
      >
        <MdClose />
      </Button>

      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4">
          <span className="badge bg-success text-white mr-3">IN STOCK</span>
        </div>
      </div>

      <div className="row mt-2 productDetailsModal">
        <div className="col-md-5">
          <ProductZoom />
        </div>

        <div className="col-md-7">
          <div className="product-details">
            <h1>ĐÀN UKULELE VALOTE VA-24M02</h1>
            <div className="rating-review">
              <Rating
                name="read-only"
                value={4}
                readOnly
                size="small"
                precision={0.5}
              />
              <span className="cursor">1 Review</span>
            </div>

            <div className="price">
              <span className="current-price">1.425.000 VNĐ</span>
              <span className="original-price">1.500.000 VNĐ</span>
              <span className="discount">-5%</span>
            </div>
            <div className="d-flex align-items-center mt-3 mb-3">
              <QuantityBox />
              <Button className="btn-add-to-cart ml-3"><FaCartPlus/> &nbsp; Add to Cart</Button>
            </div>
            <div className="details-table">
              <table>
                <tbody>
                  <tr>
                    <th>Thương hiệu</th>
                    <td>Valote</td>
                  </tr>
                  <tr>
                    <th>Model</th>
                    <td>VA-24M02</td>
                  </tr>
                  <tr>
                    <th>Phân loại</th>
                    <td>Concert</td>
                  </tr>
                  <tr>
                    <th>Số phím</th>
                    <td>18 phím</td>
                  </tr>
                  <tr>
                    <th>Kích thước</th>
                    <td>24</td>
                  </tr>
                  <tr>
                    <th>Mặt trước</th>
                    <td>Gỗ Vân Sam nguyên tấm</td>
                  </tr>
                  <tr>
                    <th>Mặt sau/ bên</th>
                    <td>Gỗ Gụ</td>
                  </tr>
                  <tr>
                    <th>Mặt phím đàn</th>
                    <td>Gỗ Hồng Sắc</td>
                  </tr>
                  <tr>
                    <th>Dây</th>
                    <td>Nylon</td>
                  </tr>
                  <tr>
                    <th>Ưu điểm</th>
                    <td>
                      <ul>
                        <li>
                          Ukulele Concert, gỗ <b>Vân sam Solid nguyên tấm</b>
                        </li>
                        <li>Màu gỗ tự nhiên, đẹp, hiện đại</li>
                        <li>Âm sắc sáng, trong trẻo và độ vang đều</li>
                        <li>Dễ chơi, dễ học, giá tốt</li>
                        <li>Nhỏ gọn, có thể mang đi bất cứ đâu</li>
                        <li>Dây mềm, bấm không đau tay</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th>Màu sắc</th>
                    <td>Tự nhiên</td>
                  </tr>
                  <tr>
                    <th>Quà tặng</th>
                    <td>Bao đàn Valote</td>
                  </tr>
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
