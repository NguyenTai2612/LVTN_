import React, { useContext, useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { MyContext } from "../../App";
import Price from "../../Components/Price";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import { apiGetOrdersByUserId } from "../../services/order"; // Import service
import { FaCartArrowDown } from "react-icons/fa";
import Decimal from 'decimal.js';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const context = useContext(MyContext);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Number of orders per page
  const userName = JSON.parse(localStorage.getItem("user")).name;
  const userPhone = JSON.parse(localStorage.getItem("user")).phone;
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    try {
      const response = await apiGetOrdersByUserId(userId);
      const { data } = response;
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const showProducts = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      setProducts(order.OrderItems || []);
      setIsOpenModal(true);
    }
  };

  const paginatedOrders = orders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <section className="cartPage">
        <div className="container">
          <div className="container pt-3">
            <nav class="woocommerce-breadcrumb" aria-label="Breadcrumb">
              <ul class="breadcrumb-list">
                <li>
                  <a href="/">Trang chủ</a>
                </li>

                <li class="breadcrumb-current">Đơn hàng</li>
              </ul>
              <div class="custom-divider"></div>
            </nav>

            <div className="order-info">
              <span className="">
                <FaCartArrowDown className="mb-1" /> Thông tin đơn hàng
              </span>
            </div>
            <p>
              Tổng số đơn hàng:{" "}
              <b className="text-red">{paginatedOrders?.length}</b>
            </p>

            <div className="table-responsive orderTable">
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Id</th>
                    <th>Sẩn phẩm</th>
                    {/* <th>Name</th> */}
                    <th>Số điện thoại</th>
                    <th>Địa chỉ nhận hàng</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    {/* <th>Payment Method</th> */}
                    <th>Trạng thái đơn hàng</th>
                    <th>Ngày đặt</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="text-purple font-weight-bold">
                            {order.id}
                          </span>
                        </td>
                        <td>
                          <span
                            className="text-blue font-weight-bold cursor"
                            onClick={() => showProducts(order.id)}
                          >
                            Click here to view
                          </span>
                        </td>
                        {/* <td>{userName}</td> */}
                        <td>{userPhone}</td>
                        <td>
                          {JSON.parse(order.shipping)?.address},{" "}
                          {JSON.parse(order.shipping)?.ward},{" "}
                          {JSON.parse(order.shipping)?.district},{" "}
                          {JSON.parse(order.shipping)?.city}
                        </td>
                        <td>
                          <Price amount={order.total} />
                        </td>
                        <td>{order.payment_status}</td>
                        {/* <td>{order.payment_status}</td> */}
                        <td>
                          {order.deliver_status === "Pending" ? (
                            <span className="badge badge-danger">
                              {order.deliver_status}
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              {order.deliver_status}
                            </span>
                          )}
                        </td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {orders.length > itemsPerPage && (
              <div className="table-footer flex items-center justify-end py-2 px-3 mb-2 ml-auto">
                <Pagination
                  count={Math.ceil(orders.length / itemsPerPage)}
                  color="primary"
                  className="pagination"
                  showFirstButton
                  showLastButton
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <Dialog
        className="productModal"
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      >
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <MdClose />
        </Button>
        <h1>Product</h1>

        <div className="table-responsive orderTable">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Product Name</th>
                <th>Image</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>SubTotal</th>
              </tr>
            </thead>

            <tbody>
            {products.length > 0 ? (
  products.map((item, index) => {
    const price = new Decimal(item.price);
    const quantity = new Decimal(item.quantity);
    const subTotal = price.times(quantity); // Decimal calculation

    return (
      <tr key={index}>
        <td style={{ whiteSpace: "inherit" }}>
          <span>{item.Product?.name}</span>
        </td>
        <td>
          <div className="img">
            {item.Product?.ProductImages?.[0]?.imageUrl ? (
              <img
                src={item.Product?.ProductImages[0].imageUrl}
                alt={item.Product?.name}
              />
            ) : (
              <span>No Image Available</span>
            )}
          </div>
        </td>
        <td>{item.Product?.Brand?.name}</td>
        <td>
          <Price amount={item.price} />
        </td>
        <td>{item.quantity}</td>
        <td>
          <Price amount={subTotal.toFixed(2)} /> {/* Format to 2 decimal places */}
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="6">No products found</td>
  </tr>
)}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  );
};

export default Orders;
