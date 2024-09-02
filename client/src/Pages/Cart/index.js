import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { FaTrashCan } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { FaCartArrowDown } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  deleteCartItem,
  updateCartItem,
  getCartItems,
} from "../../services/cart";
import Price from "../../Components/Price/index.js";
import { IoBagCheckOutline } from "react-icons/io5";
import PayButton from "../Checkout/PayButton.js";
import { apiGetProductDetails } from "../../services/product.js";

const Cart = () => {
  const context = useContext(MyContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [quantityUpdates, setQuantityUpdates] = useState({});

  // Định nghĩa hàm fetchCartItems
  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      if (userId) {
        const cartItems = await getCartItems(userId);
        setCartData(cartItems);

        const productDetailsMap = await Promise.all(
          cartItems.map(async (item) => {
            const response = await apiGetProductDetails(item.product_id);
            return { id: item.product_id, data: response.data.response };
          })
        );

        // Chuyển đổi mảng thành object để dễ dàng tra cứu
        const productDetailsObj = productDetailsMap.reduce((acc, item) => {
          acc[item.id] = item.data;
          return acc;
        }, {});

        setProductDetails(productDetailsObj);
      } else {
        console.error("No user ID found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm lấy dữ liệu giỏ hàng khi component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Hàm lấy dữ liệu giỏ hàng khi userId thay đổi trong context
  useEffect(() => {
    if (context.userId) {
      fetchCartItems();
    }
  }, [context.userId]);

  // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (cartId) => {
    setIsLoading(true);
    try {
      await deleteCartItem(cartId);
      // Cập nhật dữ liệu giỏ hàng sau khi xóa
      fetchCartItems();
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý cập nhật số lượng sản phẩm
  const handleQuantityChange = (cartId, quantity) => {
    setQuantityUpdates((prev) => ({
      ...prev,
      [cartId]: quantity,
    }));
  };

  const handleUpdateQuantities = async () => {
    setIsLoading(true);
    try {
      // Duyệt qua tất cả các thay đổi trong quantityUpdates
      for (const cartId in quantityUpdates) {
        const quantity = quantityUpdates[cartId];
        // Gửi yêu cầu cập nhật số lượng sản phẩm
        await updateCartItem(cartId, quantity);
      }
      // Cập nhật dữ liệu giỏ hàng sau khi cập nhật số lượng
      fetchCartItems();
      // Sau khi cập nhật thành công, xóa quantityUpdates để tránh cập nhật lặp lại
      setQuantityUpdates({});
    } catch (error) {
      alert("Lỗi khi cập nhật số lượng sản phẩm: " + error.message);
    } finally {
      setIsLoading(false);
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
            Sản phẩm trong giỏ: <b className="text-red">{cartData.length}</b>
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
                    {cartData.length !== 0 &&
                      cartData.map((item) => {
                        const productDetail =
                          productDetails[item.product_id] || {};
                        return (
                          <tr key={item.id}>
                            <td>
                              <Link
                                to={`/product/${item.product_id}`}
                                style={{ textDecoration: "none" }}
                              >
                                <div className="cartItemimgWrapper">
                                  <div className="imgWrapper">
                                    <img
                                      src={
                                        productDetail.ProductImages?.[0]
                                          ?.imageUrl ||
                                        "/path/to/default/image.png"
                                      }
                                      alt={
                                        productDetail.name || "Product Image"
                                      }
                                    />
                                  </div>
                                  <div className="info">
                                    <h6>
                                      {productDetail.name || "Product Title"}
                                    </h6>
                                    <Rating
                                      value={
                                        parseFloat(productDetail.rating) || 0
                                      }
                                      readOnly
                                      size="small"
                                    />
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td>
                              <Price amount={item.price} />
                            </td>
                            <td>
                              <QuantityBox
                                quantity={(value) =>
                                  handleQuantityChange(item.id, value)
                                }
                                item={item}
                                selectedItem={item}
                                value={item.quantity}
                              />
                            </td>
                            <td>
                              <Price amount={item.subTotal} />
                            </td>
                            <td>
                              <span
                                className="remove"
                                onClick={() => removeItem(item.id)}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateQuantities}
              >
                Cập Nhật Số Lượng
              </Button>
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
                          .map((item) => parseFloat(item.price) * item.quantity)
                          .reduce((total, value) => total + value, 0)}
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
                          .map((item) => parseFloat(item.price) * item.quantity)
                          .reduce((total, value) => total + value, 0)}
                      />
                    )}
                  </span>
                </div>
                <br />
                <PayButton cartItems={cartData} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {isLoading && <div className="loading"></div>}
    </div>
  );
};

export default Cart;
// editttttttttt
