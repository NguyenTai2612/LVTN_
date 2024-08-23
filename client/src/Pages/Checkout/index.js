import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { MyContext } from "../../App";
import { LuClipboardCheck } from "react-icons/lu";
import { Button } from "@mui/material";
import axios from "axios";
import { fetchDataFromApi } from "../../utils/api";
import Price from "../../Components/Price";

const Checkout = () => {
  const context = useContext(MyContext);
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [cartData, setCartData] = useState([]);

  const [formFields, setFormFields] = useState({
    fullname: "",
    phoneNumber: "",
    city: "",
    district: "",
    ward: "",
    address: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
    });
  }, []);
  const onChangeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleCityChange = async (event) => {
    const selectedCityCode = event.target.value;
    const selectedCityName = context.countryList.find(
      (item) => item.code === selectedCityCode
    )?.name;
    setCity(selectedCityCode);
    setCityName(selectedCityName);

    // Fetch districts based on the selected city
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${selectedCityCode}?depth=2`
    );
    setDistrictList(response.data.districts);
    setDistrict("");
    setWardList([]);
    setWard("");
  };

  const handleDistrictChange = async (event) => {
    const selectedDistrictCode = event.target.value;
    const selectedDistrictName = districtList.find(
      (item) => item.code === selectedDistrictCode
    )?.name;
    setDistrict(selectedDistrictCode);
    setDistrictName(selectedDistrictName);

    // Fetch wards based on the selected district
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`
    );
    setWardList(response.data.wards);
    setWard("");
  };

  const handleWardChange = (event) => {
    const selectedWardCode = event.target.value;
    const selectedWardName = wardList.find(
      (item) => item.code === selectedWardCode
    )?.name;
    setWard(selectedWardCode);
    setWardName(selectedWardName);
  };

  const checkout = (e) => {
    e.preventDefault();

    if (formFields.fullname === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill fullname",
      });
      return false;
    }

    if (formFields.phoneNumber === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill phone Number",
      });
      return false;
    }

    if (!cityName) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please select a city",
      });
      return false;
    }

    if (!districtName) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please select a district",
      });
      return false;
    }

    if (!wardName) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please select a ward",
      });
      return false;
    }

    const addressInfo = {
      ...formFields,
      city: cityName,
      district: districtName,
      ward: wardName,
      date: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    };
    console.log(addressInfo);
  };
  return (
    <section>
      <div className="cartPage">
        <div className="section">
          <div className="container pt-3">
            <form className="checkoutForm" onSubmit={checkout}>
              <div className="row">
                <div className="col-md-6">
                  <div className="order-info ">
                    <span className="order-info-text mb-2">
                      <LuClipboardCheck className="mb-1" /> Thông tin thanh toán
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
                            value={city}
                            label="Chọn tỉnh/thành phố"
                            onChange={handleCityChange}
                          >
                            {context.countryList?.map((item, index) => (
                              <MenuItem value={item.code} key={index}>
                                {item.name}
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
                            value={district}
                            label="Chọn quận/huyện"
                            onChange={handleDistrictChange}
                            disabled={!city}
                          >
                            {districtList?.map((item, index) => (
                              <MenuItem value={item.code} key={index}>
                                {item.name}
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
                            Chọn xã/phường
                          </InputLabel>
                          <Select
                            labelId="ward-select-label"
                            id="ward-select"
                            value={ward}
                            label="Chọn xã/phường"
                            onChange={handleWardChange}
                            disabled={!district}
                          >
                            {wardList?.map((item, index) => (
                              <MenuItem value={item.code} key={index}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          label="Ví dụ: Số 20, ngõ 19"
                          variant="outlined"
                          size="small"
                          className="w-100"
                          name="address"
                          onChange={onChangeInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card orderInfo">
                    <div className="order-info ">
                      <span className="order-info-text mb-2">
                        Đơn hàng của bạn
                      </span>
                    </div>
                    <div className="table-reponsive mt-3">
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Tổng</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cartData?.length !== 0 &&
                            cartData?.map((item, index) => {
                              return (
                                <tr>
                                  <td>
                                    {item?.productTitle}
                                    <b style={{ color: "blue" }}>
                                      {" "}
                                      × {item?.quantity}
                                    </b>
                                  </td>

                                  <td>
                                    <Price amount={item?.subTotal} />
                                  </td>
                                </tr>
                              );
                            })}

                          <tr>
                            <td>
                              <span className="text-red">Tổng</span>
                            </td>
                            <td>
                              <span className="text-red">
                                {cartData.length !== 0 && (
                                  <Price
                                    amount={cartData
                                      .map(
                                        (item) =>
                                          parseInt(item.price) * item.quantity
                                      )
                                      .reduce(
                                        (total, value) => total + value,
                                        0
                                      )}
                                    className="your-custom-classname" // Replace with your actual class name if needed
                                  />
                                )}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="confirm">
                      <Button
                        type="submit"
                        className="btn-red btn-lg btn-big mt-4"
                      >
                        Đặt hàng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
