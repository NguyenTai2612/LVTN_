import React, { useEffect, useState } from "react";
import TooltipBox from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineRemoveRedEye, MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { apiGetAllOrders, apiGetOrderItems, apiUpdateOrderStatus, apiDeleteOrder, apiUpdateOrderAddress } from "../../services/index";
import Price from "../../components/Price";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import { MenuItem, Select } from "@mui/material";
import EditAddressModal from "./EditAddressModal";
import { FaEye } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { Stepper, Step, StepLabel } from '@mui/material';


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [isOpenStatusModal, setIsOpenStatusModal] = useState(false); // Modal thay đổi trạng thái
  const [isOpenProductModal, setIsOpenProductModal] = useState(false); // Modal xem sản phẩm
  const [products, setProducts] = useState([]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu trữ thông tin đơn hàng được chọn
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false); // Kiểm soát modal
  const steps = ["Chờ xử lý", "Đã xác nhận", "Đang giao hàng", "Đã giao", "Đã hủy"];

  const orderStatuses = [
    "Chờ xử lý",           // Pending
    "Đã xác nhận",         // Confirmed
    "Đang giao hàng",           // Out for delivery
    "Đã hủy",              // Cancelled
    "Đã giao",             // Delivered
  ];


  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await apiGetAllOrders();
      setOrders(response.data);
      console.log('setOrders', response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Hiển thị modal thay đổi trạng thái
  // Hiển thị modal thay đổi trạng thái và thiết lập trạng thái hiện tại của đơn hàng
  const showStatusModal = (order) => {
    setSelectedOrderId(order.id);
    setSelectedStatus(order.deliver_status); // Đặt trạng thái hiện tại của đơn hàng làm giá trị mặc định
    setIsOpenStatusModal(true); // Mở modal
  };


  const handleStatusChange = (newStep) => {
    setSelectedStatus(steps[newStep]);
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

  // Hiển thị modal xem sản phẩm
  const showProducts = async (orderId) => {
    setSelectedOrderId(orderId);
    try {
      const response1 = await apiGetOrderItems(orderId);
      console.log('Phản hồi Order Items:', response1);

      const orderItems = response1;

      if (orderItems && Array.isArray(orderItems)) {
        setProducts(orderItems); // Thiết lập dữ liệu sản phẩm
      } else {
        console.error('Dữ liệu OrderItems không đúng cấu trúc:', orderItems);
        setProducts([]);
      }

      setIsOpenProductModal(true); // Mở modal sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      setProducts([]);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        await apiDeleteOrder(orderId);
        fetchOrders(); // Refresh the orders list after deletion
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };


  const parseShippingAddress = (shipping) => {
    try {
      const parsed = JSON.parse(shipping);
      return `${parsed.city}, ${parsed.district}, ${parsed.ward}, ${parsed.address}`;
    } catch (error) {
      return shipping;
    }
  };

  // Mở modal và lưu lại thông tin đơn hàng được chọn
  const handleEditAddressClick = (order) => {
    const parsedAddress = JSON.parse(order.shipping); // Parse the shipping JSON
    setSelectedOrder({
      ...order,
      shipping: parsedAddress, // Include the parsed address
      name: order.name,
      phone: order.phone
    }); // Store parsed shipping address and other details in state
    setIsEditAddressOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsEditAddressOpen(false);
  };

  // Xử lý lưu địa chỉ sau khi chỉnh sửa
  const handleSaveAddress = async (updatedAddress) => {
    if (selectedOrder) {
      console.log('Selected Order:', selectedOrder); // Kiểm tra đơn hàng được chọn
      console.log('Updated Address:', updatedAddress); // Kiểm tra địa chỉ cập nhật
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
      <div className="card shadow my-4 border-0 flex-center p-3" style={{ backgroundColor: '#343A40' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold text-white">Quản lý đơn hàng</h1>
          <div className="ml-auto flex align-items-center gap-3">
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component={Link}
                href="#"
                label="Dashboard"
                to="/"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb label="Orders" />
            </Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="card shadow my-4 border-0">
        <div className="flex items-center mb-4 justify-between pt-3 px-4"></div>
        <div className="table-responsive mb-2">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Mã đơn</th>
                {/* <th>Products</th> */}
                <th>Mã khách hàng</th>
                <th>Tổng tiền</th>
                {/* <th>Shipping Address</th> */}
                <th>Trạng thái</th>
                <th>Phương thức thanh toán</th> {/* Cột tiêu đề mới */}
                <th>Thanh toán</th> {/* Cột tiêu đề mới */}
                {/* <th>Date</th> */}
                {/* <th>Edit Address</th> */}
                <th>Xem chi tiết</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    {/* <td>
                      <span
                        className="text-blue cursor"
                        onClick={() => showProducts(order.id)} // Mở modal xem sản phẩm
                      >
                        Click here to view
                      </span>
                    </td> */}
                    <td>{order.user_id}</td>
                    <td>
                      <Price amount={order.total} />
                    </td>
                    {/* <td>{parseShippingAddress(order.shipping)}</td> */}
                    <td>
                      <span className={`badge ${getStatusClass(order.deliver_status)}`}>
                        {order.deliver_status}
                      </span>
                    </td>
                    <td>{order.Payments && order.Payments.length > 0 ? order.Payments[0].paymentMethod : 'N/A'}</td>
                    <td>{order.Payments && order.Payments.length > 0 ? order.Payments[0].paymentStatus : 'N/A'}</td>
                    {/* <td>
                      {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                    </td> */}

                    <td>
                      <Link to={`/order-details/${order.id}`}>
                        <div className="actions flex items-center gap-2">

                          <TooltipBox title="View Detais" placement="top">
                            <button
                              className="edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                              onClick={() => handleEditAddressClick(order)}
                            >
                              <FaEye />
                            </button>
                          </TooltipBox>

                        </div>
                      </Link>
                    </td>

                    <td>
                      <div className="actions flex items-center gap-2">

                        <TooltipBox title="Update Status" placement="top">
                          <button
                            className="edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                            onClick={() => showStatusModal(order)}
                          >
                            <FaListCheck />
                          </button>
                        </TooltipBox>

                        <TooltipBox title="Delete" placement="top">
                          <button
                            className="delete-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                            onClick={() => handleDelete(order.id)}
                          ><MdOutlineDeleteOutline /></button>
                        </TooltipBox>

                      </div>
                    </td>

                    {/* <td>
                      <div className="actions flex items-center gap-2">

                        <TooltipBox title="Edit Address" placement="top">
                          <button
                            className="edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                            onClick={() => handleEditAddressClick(order)}
                          >
                            <FaMapMarkerAlt />
                          </button>
                        </TooltipBox>

                      </div>
                    </td> */}





                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer flex items-center justify-between py-2 px-3 mb-2">
          {orders.length > 1 && (
            <Pagination
              count={Math.ceil(orders.length / 10)} // Example pagination logic
              color="primary"
              className="pagination"
              showFirstButton
              showLastButton
              onChange={handleChange}
            />
          )}
        </div>
      </div>


      {/* Modal chỉnh sửa địa chỉ */}
      {selectedOrder && (
        <EditAddressModal
          open={isEditAddressOpen}
          handleClose={handleCloseModal}
          currentAddress={selectedOrder.shipping}  // Pass parsed address
          handleSave={handleSaveAddress}
        />
      )}


      {/* Modal thay đổi trạng thái */}
      <Dialog open={isOpenStatusModal} onClose={() => setIsOpenStatusModal(false)}>
        <div className="modal-content">
          <h2>Cập nhật trạng thái</h2>

          {/* Stepper hiển thị các bước */}
          <Stepper activeStep={steps.indexOf(selectedStatus)} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index} onClick={() => handleStatusChange(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="modal-actions">
            <Button onClick={confirmStatusChange}>Xác nhận</Button>
            <Button onClick={() => setIsOpenStatusModal(false)}>Hủy</Button>
          </div>
        </div>
      </Dialog>
      {/* Modal xem sản phẩm */}
      <Dialog
        className="productModal"
        open={isOpenProductModal} // Modal sản phẩm sử dụng state riêng
        onClose={() => setIsOpenProductModal(false)} // Đóng modal xem sản phẩm
      >
        <Button className="close_" onClick={() => setIsOpenProductModal(false)}>
          <MdClose />
        </Button>
        <h1>Order Details</h1>

        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Brand</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>SubTotal</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 &&
              products.map((item, index) => (
                <tr key={index}>
                  <td style={{ whiteSpace: "inherit" }}>
                    <span>{item.Product?.name || 'N/A'}</span>
                  </td>
                  <td>
                    <div className="img">
                      <img src={item.Product?.ProductImages[0]?.imageUrl || ''} alt={item.Product?.name || 'No Image'} />
                    </div>
                  </td>
                  <td>{item.Product?.Brand?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <Price amount={item.price} />
                  </td>
                  <td>
                    <Price amount={item.price * item.quantity} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </Dialog>
    </>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Chờ xử lý':
      return 'status-pending';
    case 'Đã xác nhận':
      return 'status-confirmed';
    case 'Đang chuẩn bị':
      return 'status-processing';
    case 'Đã gửi':
      return 'status-shipped';
    case 'Đang giao hàng':
      return 'status-out-for-delivery';
    case 'Đã giao':
      return 'status-delivered';
    case 'Đã hủy':
      return 'status-cancelled';
    case 'Không giao được':
      return 'status-failed';
    default:
      return '';
  }
};



export default Orders;
//edit ok ///