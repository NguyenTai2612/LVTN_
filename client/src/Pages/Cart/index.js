import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { FaTrashCan } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { FaCartArrowDown } from "react-icons/fa";


const Cart = () => {
  return (
    <div className="cartPage">
      <section className="section">
        <div className="container pt-3">
        <div className="order-info">
            <span className="order-info-text"><FaCartArrowDown className="mb-1"/>  Thông Tin Đơn Hàng</span>
        </div>
        <p>Sản phẩm trong giỏ: <b className="text-red">3</b></p>
          <div className="row">
            <div className="col-md-8">          
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="40%">Sản Phẩm</th>
                      <th>Giá</th>
                      <th>Số Lượng</th>
                      <th>Thành Tiền</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Link to={"/product/1"} style={{ textDecoration: "none" }}>
                          <div className="cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src="https://nhaccutiendat.vn/upload/img/dan-piano-dien-roland-hp-702_9871.jpg" alt="Roland HP-702 Piano" />
                            </div>
                            <div className="info">
                              <h6>Đàn Piano điện Roland HP-702</h6>
                              <Rating value={4} readOnly size="small" precision={0.5} />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>32.500.000 VNĐ</td>
                      <td><QuantityBox /></td>
                      <td>32.500.000 VNĐ</td>
                      <td><span className="remove"><FaTrashCan /></span></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to={"/product/1"} style={{ textDecoration: "none" }}>
                          <div className="cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src="https://nhaccutiendat.vn/upload/img/dan-piano-dien-roland-hp-702_9871.jpg" alt="Roland HP-702 Piano" />
                            </div>
                            <div className="info">
                              <h6>Đàn Piano điện Roland HP-702</h6>
                              <Rating value={4} readOnly size="small" precision={0.5} />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>32.500.000 VNĐ</td>
                      <td><QuantityBox /></td>
                      <td>32.500.000 VNĐ</td>
                      <td><span className="remove"><FaTrashCan /></span></td>
                    </tr><tr>
                      <td>
                        <Link to={"/product/1"} style={{ textDecoration: "none" }}>
                          <div className="cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src="https://nhaccutiendat.vn/upload/img/dan-piano-dien-roland-hp-702_9871.jpg" alt="Roland HP-702 Piano" />
                            </div>
                            <div className="info">
                              <h6>Đàn Piano điện Roland HP-702</h6>
                              <Rating value={4} readOnly size="small" precision={0.5} />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>32.500.000 VNĐ</td>
                      <td><QuantityBox /></td>
                      <td>32.500.000 VNĐ</td>
                      <td><span className="remove"><FaTrashCan /></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border p-3 cartDetails">
                <h4>Giỏ hàng</h4>

                <div className="d-flex align-items-center mb-3">
                    <span>Tổng Phụ</span>
                    <span className="ml-auto font-weight-medium">32.500.000 VNĐ</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                    <span>Shipping</span>
                    <span className="ml-auto"><b>Free</b></span>
                </div>

                <div className="d-flex align-items-center mb-3">
                    <span>Tổng Tiền</span>
                    <span className="ml-auto text-red font-weight-bold">32.500.000 VNĐ</span>
                </div>
                <br />
              <Button className="btn-blue bg-red btn-lg btn-big"> Thanh toán</Button>


              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
