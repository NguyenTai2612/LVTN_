import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { Pagination } from "@mui/material";
import { MyContext } from "../../App";
import Price from "../../Components/Price";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [product, setProducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const context = useContext(MyContext);
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/stripe?page=1&perPage=8`).then((res) => {
      setOrders(res);
    });
  }, []);

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

  return (
    <>
      <section className="section">
        <div className="container">
          <h2 className="hd">Orders</h2>

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
                              <span className="badge badge-danger">
                                {order?.deliver_status}
                              </span>
                            ) : (
                              <span className="badge badge-success">
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
      </section>

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
                      <td style={{whiteSpace:"inherit"}}>
                        <span >
                        {item?.productTitle?.substr(0,30)+'...'}
                        </span>
                      </td>
                      <td>
                        <div className="img">
                            <img src={item?.image}/>
                        </div>
                      </td>
                      <td>{item?.brand}</td>
                      <td>{item?.quantity}</td>
                      <td><Price amount={item?.price}/></td>
                      <td><Price amount={item?.price * item?.quantity}/></td>
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
