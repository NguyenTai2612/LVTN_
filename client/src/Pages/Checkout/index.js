import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { MyContext } from "../../App";
import { LuClipboardCheck } from "react-icons/lu";
import { Button, Modal, Typography, Box } from "@mui/material";
import axios from "axios";
import Price from "../../Components/Price";
import { deleteAllCartByUserId, getCartItems } from "../../services/cart";
import {
  apiCreateOrder,
  apiAddOrderItems,
  apiSavePaymentInfo,
} from "../../services/order";
import { useNavigate } from "react-router-dom";
import { apiGetProductDetails } from "../../services";

const Checkout = () => {
  const context = useContext(MyContext);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [openModal, setOpenModal] = useState(false);
  console.log("cartData", cartData);

  const navigate = useNavigate();

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const [formFields, setFormFields] = useState({
    fullname: "",
    phoneNumber: "",
    address: "",
  });

  const onChangeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      if (userId) {
        const items = await getCartItems(userId);
        setCartData(items);
      }
    };
    fetchCartData();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setCityList(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = async (event) => {
    const selectedCity = cityList.find((c) => c.code === event.target.value);
    setCity(selectedCity);

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`
      );
      setDistrictList(response.data.districts);
      setDistrict(null);
      setWard(null);
      setWardList([]);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (event) => {
    const selectedDistrict = districtList.find(
      (d) => d.code === event.target.value
    );
    setDistrict(selectedDistrict);

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
      );
      setWardList(response.data.wards);
      setWard(null);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (event) => {
    const selectedWard = wardList.find((w) => w.code === event.target.value);
    setWard(selectedWard);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const checkout = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;

      // Kiểm tra thông tin đầy đủ
      if (
        formFields.fullname === "" ||
        formFields.phoneNumber === "" ||
        !city ||
        !district ||
        !ward
      ) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Vui lòng điền đầy đủ thông tin.",
        });
        return;
      }

      // Chuẩn bị dữ liệu đơn hàng
      const subTotal = cartData.reduce(
        (total, item) => total + item.Product.price * item.quantity,
        0
      );
      localStorage.setItem("amount", subTotal);
      const orderData = {
        user_id: userId,
        subTotal: subTotal,
        total: subTotal,
        shipping: {
          city: city ? city.name : "",
          district: district ? district.name : "",
          ward: ward ? ward.name : "",
          address: formFields.address,
        },
        name: formFields.fullname,
        phone: formFields.phoneNumber,
        deliver_status: "Chờ xử lý",
        date: new Date(),
      };

      if (paymentMethod === "BANK") {
        // Lưu thông tin đơn hàng
        const orderResponse = await apiCreateOrder(orderData);
        const orderId = orderResponse.data.id;
        // Lưu orderId vào localStorage
        localStorage.setItem("orderId", orderId);

        // Thêm sản phẩm vào đơn hàng
        const items = cartData.map((item) => ({
          product_id: item.Product.id,
          quantity: item.quantity,
          price: item.price,
        }));
        await apiAddOrderItems(orderId, items);

       

        // Tạo phiên thanh toán của Stripe
        const res = await axios.post(
          `http://localhost:5000/api/v1/stripe/create-checkout-session`,
          {
            cartData,
            orderId: orderId,
          }
        );

        if (res.data.url) {
          // Chuyển hướng đến URL Stripe checkout
          window.location.href = res.data.url;
        }
      } else {
        // Thực hiện xử lý cho các phương thức thanh toán khác
        if (formFields.fullname === "" || formFields.phoneNumber === "") {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Vui lòng điền đầy đủ thông tin.",
          });
          return;
        }

        // Tạo đơn hàng
        const orderResponse = await apiCreateOrder(orderData);
        const orderId = orderResponse.data.id;

        // Thêm sản phẩm vào đơn hàng
        const items = cartData.map((item) => ({
          product_id: item.Product.id,
          quantity: item.quantity,
          price: item.price,
        }));
        await apiAddOrderItems(orderId, items);

        // Xóa toàn bộ giỏ hàng của user
        await deleteAllCartByUserId(userId);

        // Lưu thông tin thanh toán
        const paymentData = {
          order_id: orderId,
          paymentMethod,
          paymentStatus: "Chờ thanh toán",
          amount: orderData.total,
          paymentDate: new Date(),
        };
        await apiSavePaymentInfo(paymentData);

        // Thông báo thành công
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Đặt hàng thành công.",
        });
        navigate("/orders");
      }
    } catch (error) {
      // Xử lý lỗi và thông báo cho người dùng
      context.setAlertBox({
        open: true,
        error: true,
        msg: error.message || "Lỗi khi đặt hàng.",
      });
      console.error("Lỗi khi đặt hàng:", error);
    } finally {
      // Đóng modal xác nhận
      handleCloseModal();
    }
  };

  //edit

  return (
    <section>
      <div className="cartPage">
        <div className="section">
          <div className="container pt-3">
            <nav className="woocommerce-breadcrumb" aria-label="Breadcrumb">
              <ul className="breadcrumb-list">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li className="breadcrumb-current">Thanh toán</li>
              </ul>
              <div className="custom-divider"></div>
            </nav>
            <form className="checkoutForm" onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-md-6">
                  <div className="card orderInfo">
                    <div className="order-info">
                      <span className="ordertext mb-2">
                        <LuClipboardCheck className="mb-1" /> Thông tin thanh
                        toán
                      </span>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            label="Họ tên của bạn"
                            variant="outlined"
                            size="small"
                            className="w-100"
                            name="fullname"
                            value={formFields.fullname}
                            onChange={onChangeInput}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            label="Số điện thoại"
                            variant="outlined"
                            size="small"
                            className="w-100"
                            name="phoneNumber"
                            value={formFields.phoneNumber}
                            onChange={onChangeInput}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <FormControl fullWidth size="small">
                            <InputLabel id="city-select-label">
                              Chọn tỉnh/thành phố
                            </InputLabel>
                            <Select
                              labelId="city-select-label"
                              id="city-select"
                              value={city ? city.code : ""}
                              label="Chọn tỉnh/thành phố"
                              onChange={handleCityChange}
                            >
                              {cityList.map((city) => (
                                <MenuItem key={city.code} value={city.code}>
                                  {city.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <FormControl fullWidth size="small">
                            <InputLabel id="district-select-label">
                              Chọn quận/huyện
                            </InputLabel>
                            <Select
                              labelId="district-select-label"
                              id="district-select"
                              value={district ? district.code : ""}
                              label="Chọn quận/huyện"
                              onChange={handleDistrictChange}
                            >
                              {districtList.map((district) => (
                                <MenuItem
                                  key={district.code}
                                  value={district.code}
                                >
                                  {district.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <FormControl fullWidth size="small">
                            <InputLabel id="ward-select-label">
                              Chọn phường/xã
                            </InputLabel>
                            <Select
                              labelId="ward-select-label"
                              id="ward-select"
                              value={ward ? ward.code : ""}
                              label="Chọn phường/xã"
                              onChange={handleWardChange}
                            >
                              {wardList.map((ward) => (
                                <MenuItem key={ward.code} value={ward.code}>
                                  {ward.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="form-group">
                          <TextField
                            label="Địa chỉ cụ thể"
                            variant="outlined"
                            size="small"
                            className="w-100"
                            name="address"
                            onChange={onChangeInput}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="form-group">
                          <FormControl fullWidth size="small">
                            <InputLabel id="payment-method-select-label">
                              Phương thức thanh toán
                            </InputLabel>
                            <Select
                              labelId="payment-method-select-label"
                              id="payment-method-select"
                              value={paymentMethod}
                              label="Phương thức thanh toán"
                              onChange={handlePaymentChange}
                            >
                              <MenuItem value="COD">
                                Thanh toán khi nhận hàng
                              </MenuItem>
                              <MenuItem value="BANK">
                                Chuyển khoản ngân hàng
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="orderInfo">
                      <div className="order-info">
                        <span className="">
                          <LuClipboardCheck className="mb-1" /> Đơn hàng của bạn
                        </span>
                      </div>

                      <table className="table mt-3 table-borderless">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Tổng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartData.map((item) => (
                            <tr key={item.Product.id}>
                              <td>{item.Product.name}</td>
                              <td>{item.quantity}</td>
                              <td>
                                <Price amount={item.Product.price} />
                              </td>
                              <td>
                                <Price
                                  amount={item.Product.price * item.quantity}
                                />
                              </td>
                            </tr>
                          ))}
                          {/* Hiển thị tổng cộng */}
                          <tr>
                            <td colSpan="3">
                              <strong>Tổng cộng:</strong>
                            </td>
                            <td>
                              <Price
                                amount={cartData.reduce(
                                  (total, item) =>
                                    total + item.Product.price * item.quantity,
                                  0
                                )}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <Button
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        onClick={handleOpenModal}
                      >
                        Đặt hàng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal xác nhận */}
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2">
                  Xác nhận đặt hàng
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                  Bạn có chắc chắn muốn đặt hàng không?
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  <strong>Họ tên:</strong> {formFields.fullname}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Số điện thoại:</strong> {formFields.phoneNumber}
                </Typography>
                <div className="modal-actions" style={{ marginTop: 20 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={checkout}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseModal}
                    style={{ marginLeft: 10 }}
                  >
                    Hủy
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

// Style cho modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Checkout;
