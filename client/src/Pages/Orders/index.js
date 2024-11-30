import React, { useContext, useEffect, useState } from "react";
import { MenuItem, Pagination, Select, Tooltip } from "@mui/material";
import { MyContext } from "../../App";
import Price from "../../Components/Price";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import {
  apiGetOrdersByUserId,
  apiUpdateOrderAddress,
  apiUpdateOrderContact,
  apiUpdateOrderStatus,
} from "../../services/order"; // Import service
import { FaCartArrowDown } from "react-icons/fa";
import Decimal from "decimal.js";
import TooltipBox from "@mui/material/Tooltip";
import { FaEdit } from "react-icons/fa";
import EditAddressModal from "./EditAddressModal";
import { FaMapMarkerAlt } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isCancelable, setIsCancelable] = useState({});
  const [products, setProducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const context = useContext(MyContext);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Number of orders per page
  const userName = JSON.parse(localStorage.getItem("user")).name;
  const userPhone = JSON.parse(localStorage.getItem("user")).phone;

  const [contactDetails, setContactDetails] = useState({ name: "", phone: "" });
  const [isEditContactOpen, setIsEditContactOpen] = useState(false); // New state for the modal

  const [isOpenStatusModal, setIsOpenStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu trữ thông tin đơn hàng được chọn
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false); // Kiểm soát modal
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);

  const orderStatuses = [
    "Đã hủy", // Cancelled
  ];

  const showStatusModal = (order) => {
    setSelectedOrderId(order.id);
    setSelectedStatus(order.deliver_status);
    setIsOpenStatusModal(true); // Mở modal
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value); // Lấy trạng thái mới
  };

  const handleEditContactClick = (order) => {
    setContactDetails({ name: order.name, phone: order.phone });
    setSelectedOrder(order); // Ensure selectedOrder is set
    setIsEditContactOpen(true);
  };
  const confirmContactChange = async () => {
    if (!selectedOrder) {
      console.error("No order selected");
      return;
    }

    try {
      await apiUpdateOrderContact(selectedOrder.id, contactDetails);
      setIsEditContactOpen(false); // Close the modal
      fetchOrders(); // Refresh orders list after update
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  };
  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId); // Lưu lại orderId của đơn hàng cần hủy
    setIsOpenCancelModal(true); // Mở modal xác nhận
  };

  const confirmCancelOrder = async () => {
    try {
      await apiUpdateOrderStatus(selectedOrderId, "Đã hủy"); // Gọi API hủy đơn hàng
      setIsOpenCancelModal(false); // Đóng modal sau khi hủy
      fetchOrders(); // Cập nhật lại danh sách đơn hàng sau khi hủy
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const confirmStatusChange = async () => {
    try {
      await apiUpdateOrderStatus(selectedOrderId, selectedStatus);
      setIsOpenStatusModal(false); // Đóng modal sau khi cập nhật trạng thái
      fetchOrders(); // Refresh danh sách đơn hàng
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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

      // Check for each order if cancel button should be disabled based on time
      const cancelableStatus = data.reduce((acc, order) => {
        const createdTime = new Date(order.createdAt).getTime();
        const currentTime = Date.now();
        const isOrderCancelable = currentTime - createdTime < 5 * 60 * 1000;
        acc[order.id] = isOrderCancelable;
        return acc;
      }, {});
      setIsCancelable(cancelableStatus);

      // Set timeout for each order to disable cancel button after 5 minutes
      data.forEach((order) => {
        const createdTime = new Date(order.createdAt).getTime();
        const timeRemaining = 5 * 60 * 1000 - (Date.now() - createdTime);
        if (timeRemaining > 0) {
          setTimeout(() => {
            setIsCancelable((prev) => ({ ...prev, [order.id]: false }));
          }, timeRemaining);
        }
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsEditAddressOpen(false);
  };

  const showProducts = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      setProducts(order.OrderItems || []);
      setIsOpenModal(true);
    }
  };

  // const paginatedOrders = orders.slice(
  //   (page - 1) * itemsPerPage,
  //   page * itemsPerPage
  // );

  const paginatedOrders = orders
  .slice() // Tạo một bản sao của mảng orders để không thay đổi trực tiếp mảng gốc
  .reverse() // Đảo ngược mảng
  .slice((page - 1) * itemsPerPage, page * itemsPerPage); // Phân trang


  // Mở modal và lưu lại thông tin đơn hàng được chọn
  const handleEditAddressClick = (order) => {
    const parsedAddress = JSON.parse(order.shipping); // Parse the shipping JSON
    setSelectedOrder({ ...order, shipping: parsedAddress }); // Store parsed shipping address in state
    setIsEditAddressOpen(true);
  };

  // Xử lý lưu địa chỉ sau khi chỉnh sửa
  const handleSaveAddress = async (updatedAddress) => {
    if (selectedOrder) {
      console.log("Selected Order:", selectedOrder); // Kiểm tra đơn hàng được chọn
      console.log("Updated Address:", updatedAddress); // Kiểm tra địa chỉ cập nhật
      try {
        await apiUpdateOrderAddress(selectedOrder.id, updatedAddress);
        setIsEditAddressOpen(false);
        fetchOrders(); // Cập nhật lại danh sách đơn hàng sau khi lưu
      } catch (error) {
        console.error("Error updating order address:", error);
      }
    }
  };

  return (
    <>
    
        <div className="cartPage">
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
                    <th>Mã</th>
                    <th>Sẩn phẩm</th>
                    {/* <th>Name</th> */}
                    <th>Tên KH</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ nhận hàng</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    {/* <th>Payment Method</th> */}
                    <th>Trạng thái đơn hàng</th>
                    <th>Ngày tạo</th>
                    <th>Cập nhật thông tin</th>
                    <th>Hủy đơn</th>
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
                            Xem chi tiết
                          </span>
                        </td>
                        {/* <td>{userName}</td> */}
                        <td>{order.name}</td>
                        <td>{order.phone}</td>
                        <td>
                          {JSON.parse(order.shipping)?.address},{" "}
                          {JSON.parse(order.shipping)?.ward},{" "}
                          {JSON.parse(order.shipping)?.district},{" "}
                          {JSON.parse(order.shipping)?.city}
                        </td>
                        <td>
                          <Price amount={order.total} />
                        </td>
                        <td>
                          {order.Payments && order.Payments.length > 0 ? (
                            order.Payments[0].paymentStatus ===
                            "Đã thanh toán" ? (
                              <span className="payment-completed">
                                {order.Payments[0].paymentStatus}
                              </span>
                            ) : order.Payments[0].paymentStatus ===
                              "Chưa thanh toán" ? (
                              <span className="payment-pending">
                                {order.Payments[0].paymentStatus}
                              </span>
                            ) : (
                              order.Payments[0].paymentStatus
                            )
                          ) : (
                            "N/A"
                          )}
                        </td>

                        {/* <td>{order.payment_status}</td> */}
                        <td>
                          <span
                            className={`badge ${getStatusClass(
                              order.deliver_status
                            )}`}
                          >
                            {order.deliver_status}
                          </span>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </td>

                        <td>
                          <div className="actions1 flex items-center gap-2">
                            <TooltipBox
                              title="Edit Name & Phone"
                              placement="top"
                            >
                              <button
                                className="edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                                onClick={() => handleEditContactClick(order)} // New handler function
                              >
                                <FaEdit />
                              </button>
                            </TooltipBox>
                            <TooltipBox title="Edit Address" placement="top">
                              <button
                                className="edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                                onClick={() => handleEditAddressClick(order)}
                              >
                                <FaMapMarkerAlt />
                              </button>
                            </TooltipBox>
                          </div>
                        </td>

                        {/* Cột Hủy đơn */}
                        <td>
                          <Button
                            variant="contained"
                            color="secondary"
                            disabled={
                              !isCancelable[order.id] ||
                              order.deliver_status === "Đã hủy"
                            }
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Hủy đơn
                          </Button>
                        </td>
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
                <th>Tên sản phẩm</th>
                <th>Ảnh</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
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
                        <Price amount={subTotal.toFixed(2)} />{" "}
                        {/* Format to 2 decimal places */}
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

      {/* Modal xác nhận hủy đơn hàng */}
      <Dialog
        open={isOpenCancelModal}
        onClose={() => setIsOpenCancelModal(false)}
      >
        <div className="modal-content">
          <h2>Xác nhận hủy đơn hàng</h2>
          <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
          <div className="modal-actions">
            <Button
              onClick={() => {
                confirmCancelOrder(); // Hàm xác nhận hủy đơn
              }}
              color="primary"
              variant="contained"
            >
              Xác nhận
            </Button>
            <Button
              onClick={() => setIsOpenCancelModal(false)} // Đóng modal nếu không muốn hủy
              color="secondary"
              variant="outlined"
            >
              Hủy
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isEditContactOpen}
        onClose={() => setIsEditContactOpen(false)}
      >
        <div className="modal-content">
          <h2>Cập nhật tên & số điện thoại</h2>
          <div className="modal-body">
            <label>
              Tên:
              <input
                type="text"
                value={contactDetails.name}
                onChange={(e) =>
                  setContactDetails({ ...contactDetails, name: e.target.value })
                }
              />
            </label>
            <label>
              Số điện thoại:
              <input
                type="text"
                value={contactDetails.phone}
                onChange={(e) =>
                  setContactDetails({
                    ...contactDetails,
                    phone: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div className="modal-actions">
            <Button className="confirm-btn" onClick={confirmContactChange}>
              Save
            </Button>
            <Button
              className="cancel-btn"
              onClick={() => setIsEditContactOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal chỉnh sửa địa chỉ */}
      {selectedOrder && (
        <EditAddressModal
          open={isEditAddressOpen}
          handleClose={handleCloseModal}
          currentAddress={selectedOrder.shipping} // Pass parsed address
          handleSave={handleSaveAddress}
        />
      )}
    </>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case "Chờ xử lý":
      return "status-pending";
    case "Đã xác nhận":
      return "status-confirmed";
    case "Đang chuẩn bị":
      return "status-processing";
    case "Đã gửi":
      return "status-shipped";
    case "Đang giao":
      return "status-out-for-delivery";
    case "Đã giao":
      return "status-delivered";
    case "Đã hủy":
      return "status-cancelled";
    case "Không giao được":
      return "status-failed";
    default:
      return "";
  }
};

export default Orders;
//edit
