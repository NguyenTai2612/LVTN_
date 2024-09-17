import React, { useContext, useEffect, useState } from "react";
import { MenuItem, Pagination, Select, Tooltip } from "@mui/material";
import { MyContext } from "../../App";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
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

import {
    apiGetOrderById,
    apiUpdateOrderAddress,
    apiUpdateOrderContact,
    apiUpdateOrderStatus,
} from "../../services/order"; // Import service
import { FaCartArrowDown, FaMapMarkerAlt } from "react-icons/fa";
import Decimal from "decimal.js";
import TooltipBox from "@mui/material/Tooltip";
import { FaEdit } from "react-icons/fa";
import EditAddressModal from "./EditAddressModal";
import Price from "../../components/Price";
import { useParams } from "react-router-dom";
import { FaListCheck } from "react-icons/fa6";
import { Stepper, Step, StepLabel } from '@mui/material';
const OrdersDetails = () => {
    const steps = ["Chờ xử lý", "Đã xác nhận", "Đang giao hàng", "Đã giao", "Đã hủy"];
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const context = useContext(MyContext);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // Number of orders per page
    const { id } = useParams();

    const [isEditContactOpen, setIsEditContactOpen] = useState(false); // New state for the modal
    const [contactDetails, setContactDetails] = useState({ name: "", phone: "" }); // State to store name & phone

    const [isOpenStatusModal, setIsOpenStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Lưu trữ thông tin đơn hàng được chọn
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isEditAddressOpen, setIsEditAddressOpen] = useState(false); // Kiểm soát modal
    const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);

    const orderStatuses = [
        "Chờ xử lý",           // Pending
        "Đã xác nhận",         // Confirmed
        "Đang giao hàng",           // Out for delivery
        "Đã hủy",              // Cancelled
        "Đã giao",             // Delivered
    ];

    const showStatusModal = (order) => {
        setSelectedOrderId(order.id);
        setSelectedStatus(order.deliver_status);
        setIsOpenStatusModal(true); // Mở modal
    };

    const handleStatusChange = (stepIndex) => {
        setSelectedStatus(steps[stepIndex]);
    };


    const handleCancelOrder = (orderId) => {
        setSelectedOrderId(orderId); // Lưu lại orderId của đơn hàng cần hủy
        setIsOpenCancelModal(true); // Mở modal xác nhận
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
        try {
            const response = await apiGetOrderById(id);
            const { data } = response;

            // Đảm bảo orders luôn là một mảng
            setOrders(Array.isArray(data) ? data : [data]);
            console.log('setOrders', data);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
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

    const paginatedOrders = orders.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Mở modal và lưu lại thông tin đơn hàng được chọn
    const handleEditAddressClick = (order) => {
        console.log("Order Data:", order); // Check if name and phone are present
        const parsedAddress = JSON.parse(order.shipping); // Parse the shipping JSON
        setSelectedOrder({
            ...order,
            shipping: parsedAddress, // Include the parsed address
        });
        setIsEditAddressOpen(true);
    };



    // Xử lý lưu địa chỉ sau khi chỉnh sửa
    const handleSaveAddress = async (updatedAddress) => {
        if (selectedOrder) {
            try {
                const addressToUpdate = {
                    ...updatedAddress,
                    name: selectedOrder.name,
                    phone: selectedOrder.phone
                };
                await apiUpdateOrderAddress(selectedOrder.id, addressToUpdate);
                // Cập nhật thông tin liên hệ
                // await apiUpdateOrderContact(selectedOrder.id, {
                //     name: updatedAddress.name,
                //     phone: updatedAddress.phone
                // });

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
                    <h1 className="font-weight-bold text-white">Chi tiết đơn hàng</h1>
                    <div className="ml-auto flex align-items-center gap-3">
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component={Link} href="#" label="Orders" to='http://localhost:5173/orders' />
                            <StyledBreadcrumb component={Link} href="#" label="Orders Details" />
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
                                <th>Sản phẩm</th>
                                <th>Tên KH</th>
                                <th>Số Điện Thoại</th>
                                <th>Địa Chỉ</th>
                                <th>Tổng Tiền</th>
                                <th>Trạng Thái</th>
                                <th>Phương thức thanh toán</th>
                                <th>Thanh toán</th>
                                <th>Ngày tạo</th>
                                <th>Cập nhật thông tin KH</th>
                                <th>Cập nhật</th>
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
                                            <span
                                                className={`badge ${getStatusClass(
                                                    order.deliver_status
                                                )}`}
                                            >
                                                {order.deliver_status}
                                            </span>
                                        </td>
                                        <td>{order.Payments && order.Payments.length > 0 ? order.Payments[0].paymentMethod : 'N/A'}</td>
                                        <td>{order.Payments && order.Payments.length > 0 ? order.Payments[0].paymentStatus : 'N/A'}</td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString()}{" "}
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </td>

                                        <td>
                                            <div className="actions flex items-center gap-2">
                                                <TooltipBox title="Edit Name & Phone" placement="top">
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


                                            </div>
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
                {/* <div className="table-footer flex items-center justify-between py-2 px-3 mb-2">
          {orders.length > 1 && (
            <Pagination
              count={Math.ceil(orders.length / 10)} 
              color="primary"
              className="pagination"
              showFirstButton
              showLastButton
              onChange={handleChange}
            />
          )}
        </div> */}
            </div>



            {/* Modal chỉnh sửa địa chỉ */}
            {selectedOrder && (
                <EditAddressModal
                    open={isEditAddressOpen}
                    handleClose={handleCloseModal}
                    currentAddress={selectedOrder.shipping} // Pass parsed address
                    name={selectedOrder.name} // Pass name
                    phone={selectedOrder.phone}
                    handleSave={handleSaveAddress}
                />
            )}


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

            <Dialog open={isEditContactOpen} onClose={() => setIsEditContactOpen(false)}>
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
                                    setContactDetails({ ...contactDetails, phone: e.target.value })
                                }
                            />
                        </label>
                    </div>
                    <div className="modal-actions">
                        <Button onClick={confirmContactChange}>Save</Button>
                        <Button onClick={() => setIsEditContactOpen(false)}>Cancel</Button>
                    </div>
                </div>
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
        case 'Đã hủy':
            return 'status-cancelled';
        case 'Không giao được':
            return 'status-failed';
        case 'Đã giao':
            return 'status-delivered';
        default:
            return '';
    }
};

export default OrdersDetails;
//edit
