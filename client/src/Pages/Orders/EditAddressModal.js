import React, { useState, useEffect } from 'react';
import { Modal, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';

const EditAddressModal = ({ open, handleClose, currentAddress, handleSave }) => {
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (currentAddress) {
      setAddress(currentAddress.address || "");
      setName(currentAddress.name || "");
      setPhone(currentAddress.phone || "");
      setCityList([]);  // Reset city, district, and ward list to avoid inconsistent state
      setDistrictList([]);
      setWardList([]);
      console.log('Current address:', currentAddress);
    }
  }, [currentAddress]);
  

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
        setCityList(response.data);

        const currentCity = response.data.find((c) => c.name === currentAddress.city);
        if (currentCity) {
          setCity(currentCity);
          fetchDistricts(currentCity.code);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const fetchDistricts = async (cityCode) => {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
        setDistrictList(response.data.districts);

        const currentDistrict = response.data.districts.find((d) => d.name === currentAddress.district);
        if (currentDistrict) {
          setDistrict(currentDistrict);
          fetchWards(currentDistrict.code);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    const fetchWards = async (districtCode) => {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        setWardList(response.data.wards);

        const currentWard = response.data.wards.find((w) => w.name === currentAddress.ward);
        if (currentWard) {
          setWard(currentWard);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    };

    fetchCities();
  }, [currentAddress]);

  const handleCityChange = async (event) => {
    const selectedCity = cityList.find((c) => c.code === event.target.value);
    setCity(selectedCity);

    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`);
      setDistrictList(response.data.districts);
      setDistrict(null);
      setWard(null);
      setWardList([]);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (event) => {
    const selectedDistrict = districtList.find((d) => d.code === event.target.value);
    setDistrict(selectedDistrict);

    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
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

  const handleSubmit = () => {
    const updatedAddress = {
      city: city ? city.name : currentAddress.city,
      district: district ? district.name : currentAddress.district,
      ward: ward ? ward.name : currentAddress.ward,
      address: address || currentAddress.address,
      name: name || currentAddress.name,
      phone: phone || currentAddress.phone,
    };
    handleSave(updatedAddress);
    handleClose();  // Close modal after saving
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-container">
        <div className="modal-content">
          <h3>Cập nhật địa chỉ giao hàng</h3>
          <div className="row mt-3">
            <div className="col-md-6">
              <FormControl fullWidth size="small">
                <InputLabel id="city-select-label">Chọn tỉnh/thành phố</InputLabel>
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
            <div className="col-md-6">
              <FormControl fullWidth size="small">
                <InputLabel id="district-select-label">Chọn quận/huyện</InputLabel>
                <Select
                  labelId="district-select-label"
                  id="district-select"
                  value={district ? district.code : ""}
                  label="Chọn quận/huyện"
                  onChange={handleDistrictChange}
                  disabled={!city}
                >
                  {districtList.map((district) => (
                    <MenuItem key={district.code} value={district.code}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <FormControl fullWidth size="small">
                <InputLabel id="ward-select-label">Chọn phường/xã</InputLabel>
                <Select
                  labelId="ward-select-label"
                  id="ward-select"
                  value={ward ? ward.code : ""}
                  label="Chọn phường/xã"
                  onChange={handleWardChange}
                  disabled={!district}
                >
                  {wardList.map((ward) => (
                    <MenuItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6">
              <TextField
                label="Số nhà, đường"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                size="small"
              />
            </div>
          </div>
          {/* <div className="row mt-3">
            <div className="col-md-6">
              <TextField
                label="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
              />
            </div>
          </div> */}
          <div className="modal-footer">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAddressModal;
//edittttt