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
import { apiGetAllOrders, apiGetOrderItems, apiUpdateOrderStatus, apiDeleteOrder } from "../../services/index";
import Price from "../../components/Price";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  const showProducts = async (orderId) => {
    setSelectedOrderId(orderId);
    try {
      const response1 = await apiGetOrderItems(orderId);
      console.log('Phản hồi Order Items:', response1);
  
      // Dữ liệu phản hồi là một mảng các đối tượng
      const orderItems = response1; // Dữ liệu bạn nhận được từ API
  
      // Kiểm tra nếu dữ liệu là mảng và có dữ liệu
      if (orderItems && Array.isArray(orderItems)) {
        setProducts(orderItems); // Thiết lập dữ liệu sản phẩm
      } else {
        console.error('Dữ liệu OrderItems không đúng cấu trúc:', orderItems);
        setProducts([]);
      }
  
      setIsOpenModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      setProducts([]);
    }
  };
  


  const orderStatus = async (status, orderId) => {
    try {
      await apiUpdateOrderStatus(orderId, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (orderId) => {
    try {
      await apiDeleteOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
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

  return (
    <>
      <div className="card shadow my-4 border-0 flex-center p-3" style={{ backgroundColor: '#343A40' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold text-white">Orders List</h1>
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
                <th>Order Id</th>
                <th>Products</th>
                <th>User Id</th>
                <th>Total Amount</th>
                <th>Shipping Address</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <span
                        className="text-blue font-weight-bold cursor"
                        onClick={() => showProducts(order.id)}
                      >
                        Click here to view
                      </span>
                    </td>
                    <td>{order.user_id}</td>
                    <td>
                      <Price amount={order.total} />
                    </td>
                    <td>{parseShippingAddress(order.shipping)}</td>
                    <td>
                      {order.deliver_status === "Processing" ? (
                        <span className="badge badge-warning cursor"
                          onClick={() => orderStatus("Completed", order.id)}
                        >
                          {order.deliver_status}
                        </span>
                      ) : (
                        <span className="badge badge-success cursor"
                          onClick={() => orderStatus("Processing", order.id)}
                        >
                          {order.deliver_status}
                        </span>
                      )}
                    </td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <Button onClick={() => handleDelete(order.id)}>
                        <MdOutlineDeleteOutline />
                      </Button>
                    </td>
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

      <Dialog
        className="productModal"
        open={isOpenModal} // Đảm bảo rằng trạng thái mở của modal được điều khiển đúng cách
        onClose={() => setIsOpenModal(false)} // Thêm onClose để đóng modal
      >
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <MdClose />
        </Button>
        <h1>Order Details</h1>

        <div className="table-responsive orderTable">
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
        </div>
      </Dialog>


    </>
  );
};

export default Orders;
