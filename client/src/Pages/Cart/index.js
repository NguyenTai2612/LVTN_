import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { FaTrashCan } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { FaCartArrowDown } from "react-icons/fa";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import Price from "../../Components/Price/index.js";
import { IoBagCheckOutline } from "react-icons/io5";
import PayButton from "../Checkout/PayButton.js";
const Cart = () => {
  const context = useContext(MyContext);
  const [cartData, setCartData] = useState([]);
  const [productQty, setProductQty] = useState();
  let [cartFields, setCartFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQty, setSelectedQty] = useState();
  const [chengeQty, setChengeQty] = useState(0);

  const quantity = (val) => {
    setProductQty(val);
    setChengeQty(val);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
      setSelectedQty(res?.quantity);
    });
  }, []);

  const removeItem = (id) => {
    setIsLoading(true);

    deleteData(`/api/cart/${id}`).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "item remove from cart!",
      });

      const user = JSON.parse(localStorage.getItem("user"));
      fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
        setCartData(res);
        setIsLoading(false);
      });

      context.getCartData();
    });
  };

  // const checkout=async()=>{
  //   const stripe = await loadStripe(process.env.REACT_STRIPE_PUBLISHABLE_KEY)

  //   const cartProducts = cartData.map((product)=>({
  //     productTitle:product?.productTitle,
  //     image:product?.image,
  //     price:product?.price,
  //     quantity:product?.quantity,
  //   }))
  // }

  const selectedItem = (item, qtyVal) => {
    if (chengeQty !== 0) {
      const user = JSON.parse(localStorage.getItem("user"));

      cartFields.productTitle = item?.productTitle;
      cartFields.image = item?.image;
      cartFields.rating = item?.rating;
      cartFields.price = item?.price;
      cartFields.brand = item?.brand;
      cartFields.quantity = qtyVal;
      cartFields.subTotal = parseInt(item?.price * qtyVal);
      cartFields.productId = item?.id;
      cartFields.userId = user?.userId;

      setIsLoading(true);
      editData(`/api/cart/${item?._id}`, cartFields).then((res) => {
        setTimeout(() => {
          setIsLoading(false);
          fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res);
          });
        }, 500);
      });
    }
  };

  return (
    <div className="cartPage">
      <section className="section">
        <div className="container pt-3">
          <div className="order-info">
            <span className="order-info-text">
              <FaCartArrowDown className="mb-1" /> Thông Tin Đơn Hàng
            </span>
          </div>
          <p>
            Sản phẩm trong giỏ: <b className="text-red">{cartData?.length}</b>
          </p>
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
                    {cartData?.length !== 0 &&
                      cartData?.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              <Link
                                to={`/product/${item?.productId}`}
                                style={{ textDecoration: "none" }}
                              >
                                <div className="cartItemimgWrapper">
                                  <div className="imgWrapper">
                                    <img
                                      src={item?.image}
                                      alt={item?.productTitle}
                                    />
                                  </div>
                                  <div className="info">
                                    <h6>{item?.productTitle}</h6>
                                    <Rating
                                      value={item?.rating}
                                      readOnly
                                      size="small"
                                    />
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td>
                              <Price amount={item?.price} />
                            </td>
                            <td>
                              <QuantityBox
                                quantity={quantity}
                                item={item}
                                selectedItem={selectedItem}
                                value={item?.quantity}
                              />
                            </td>
                            <td>
                              <Price amount={item?.subTotal} />
                            </td>
                            <td>
                              <span
                                className="remove"
                                onClick={() => removeItem(item?._id)}
                              >
                                <FaTrashCan />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border p-3 cartDetails">
                <h4>Giỏ hàng</h4>

                <div className="d-flex align-items-center mb-3">
                  <span>Tổng Phụ</span>
                  <span className="ml-auto font-weight-medium">
                    {cartData.length !== 0 && (
                      <Price
                        amount={cartData
                          .map((item) => parseInt(item.price) * item.quantity)
                          .reduce((total, value) => total + value, 0)}
                        className="your-custom-classname" // Replace with your actual class name if needed
                      />
                    )}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span>Shipping</span>
                  <span className="ml-auto">
                    <b>Free</b>
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span>Tổng Tiền</span>
                  <span className="ml-auto text-red font-weight-bold">
                    {cartData.length !== 0 && (
                      <Price
                        amount={cartData
                          .map((item) => parseInt(item.price) * item.quantity)
                          .reduce((total, value) => total + value, 0)}
                        className="your-custom-classname" // Replace with your actual class name if needed
                      />
                    )}
                  </span>
                </div>
                <br />
                {/* <Link className="checkout-btn w-100" to={`/checkout`}> */}
                  <PayButton cartItems={cartData}/>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {isLoading === true && <div className="loading"></div>}
    </div>
  );
};

export default Cart;
