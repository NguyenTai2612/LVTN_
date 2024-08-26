import React, { useEffect, useState } from "react";
import TooltipBox from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineRemoveRedEye, MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { editData, fetchDataFromApi } from "../../utils/api";
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
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [product, setProducts] = useState([]);

  const [singleOrder, setSingleOrder] = useState();


  const selectAll = (e) => {
    setIsAllChecked(e.target.checked);
  }

  const handleChange = (event, value) => {
    setPage(value);
    fetchDataFromApi(`/api/stripe?page=${value}&perPage=8`).then((res) => {
      setOrders(res);
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
    });
  };

  const showProducts = (id) => {
    fetchDataFromApi(`/api/stripe/${id}`).then((res) => {
      setIsOpenModal(true);
      setProducts(res.products);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/stripe?page=1&perPage=8`).then((res) => {
      setOrders(res);
    });
  }, []);

  const orderStatus = (status, id) => {
    fetchDataFromApi(`/api/stripe/${id}`).then((res) => {

      const order = {
        name: res.shipping.name,
        email: res.shipping.email,
        address: res.shipping.address.city,
        phone: res.shipping.phone,
        paymentId: res.customerId,
        userid: res.userId,
        products: res.products,
        total: res.total,
        deliver_status: status,
      }
      console.log(order)

      editData(`/api/stripe/${id}`, order).then((res) => {
        fetchDataFromApi(`/api/stripe?page=${1}&perPage=8`).then((res) => {
          setOrders(res);
          window.scrollTo({
            top: 200,
            behavior: "smooth",
          });
        });
      })

      setSingleOrder(res.products);
    });
  }

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
          <div className="table-responsive orderTable">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Payment Id</th>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Total Amount</th>
                  <th>Email</th>
                  <th>User Id</th>
                  <th>Order Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders?.odrderList?.length !== 0 &&
                  orders?.odrderList?.map((order, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>
                            <span className="text-purple font-weight-bold">
                              {order?.id}
                            </span>
                          </td>
                          <td>
                            <span
                              className="text-blue font-weight-bold cursor"
                              onClick={() => showProducts(order?._id)}
                            >
                              Click here to view
                            </span>
                          </td>
                          <td>{order?.shipping?.name}</td>
                          <td>{order?.shipping?.phone}</td>
                          <td>
                            {order?.shipping?.address?.city},{" "}
                            {order?.shipping?.address?.state}
                          </td>
                          <td>
                            <Price amount={order?.total} />
                          </td>
                          <td>{order?.shipping?.email}</td>
                          <td>{order?.userId}</td>
                          <td>
                            {order?.deliver_status === "pending" ? (
                              <span className="badge badge-danger cursor"
                                onClick={() => orderStatus("confirm", order?._id)}
                              >
                                {order?.deliver_status}
                              </span>
                            ) : (
                              <span className="badge badge-success cursor"
                                onClick={() => orderStatus("pending", order?._id)}
                              >
                                {order?.deliver_status}
                              </span>
                            )}
                          </td>
                          <td>{order?.date}</td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table-footer flex items-center justify-between py-2 px-3 mb-2">

          {orders?.odrderList?.totalPages > 1 && (
            <div className="table-footer flex items-center justify-end py-2 px-3 mb-2 ml-auto">
              <Pagination
                count={orders?.odrderList?.totalPages}
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

      <Dialog className="productModal" open={isOpenModal}>
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <MdClose />
        </Button>
        <h1>Product</h1>

        <div className="table-responsive orderTable">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                {/* <th>Product Id</th> */}
                <th>Product Name</th>
                <th>Image</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>SubTotal</th>
              </tr>
            </thead>

            <tbody>
              {product?.length !== 0 &&
                product?.map((item, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{item?.productId}</td> */}
                      <td style={{ whiteSpace: "inherit" }}>
                        <span>{item?.productTitle?.substr(0, 30) + "..."}</span>
                      </td>
                      <td>
                        <div className="img">
                          <img src={item?.image} />
                        </div>
                      </td>
                      <td>{item?.brand}</td>
                      <td>{item?.quantity}</td>
                      <td>
                        <Price amount={item?.price} />
                      </td>
                      <td>
                        <Price amount={item?.price * item?.quantity} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  );
};

export default Orders;
