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

  // Fetch cart items
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

        // Convert array to object for easier lookup
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

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (context.userId) {
      fetchCartItems();
    }
  }, [context.userId]);

  // Remove item from cart
  const removeItem = async (cartId) => {
    setIsLoading(true);
    try {
      await deleteCartItem(cartId);
      fetchCartItems();
    } catch (error) {
      alert("Error removing item from cart: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (cartId, newQuantity) => {
    setCartData((prevCartData) =>
      prevCartData.map((item) =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
    setQuantityUpdates((prevUpdates) => ({
      ...prevUpdates,
      [cartId]: newQuantity,
    }));
  };

  // Update quantities
  const handleUpdateQuantities = async () => {
    setIsLoading(true);
    try {
      for (const cartId in quantityUpdates) {
        const updatedQuantity = quantityUpdates[cartId];
        await updateCartItem(cartId, updatedQuantity); // Make API call
      }
      await fetchCartItems(); // Refresh cart items
      setQuantityUpdates({});
    } catch (error) {
      alert("Error updating item quantities: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price and subtotal
  const calculateTotal = () => {
    return cartData
      .reduce((total, item) => {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseInt(item.quantity);
        return total + itemPrice * itemQuantity;
      }, 0)
      .toFixed(2); // Convert to 2 decimal places
  };

  return (
    <div className="cartPage">
      <section className="section">
        <div className="container pt-3">
          <div className="order-info">
            <span className="order-info-text">
              <FaCartArrowDown className="mb-1" /> Order Information
            </span>
          </div>
          <p>
            Items in cart: <b className="text-red">{cartData.length}</b>
          </p>
          <div className="row">
            <div className="col-md-8">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="40%">Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
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
                                item={item}
                                onQuantityChange={(newQuantity) =>
                                  handleQuantityChange(item.id, newQuantity)
                                }
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
                Update Quantities
              </Button>
            </div>
            <div className="col-md-4">
              <div className="card border p-3 cartDetails">
                <h4>Cart Summary</h4>

                <div className="d-flex align-items-center mb-3">
                  <span>Subtotal</span>
                  <span className="ml-auto font-weight-medium">
                    {cartData.length !== 0 && (
                      <Price amount={calculateTotal()} />
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
                  <span>Total</span>
                  <span className="ml-auto text-red font-weight-bold">
                    {cartData.length !== 0 && (
                      <Price amount={calculateTotal()} />
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
