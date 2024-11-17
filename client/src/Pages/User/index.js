import React, { useState, useEffect } from "react";
import { Button, TextField, Dialog } from "@mui/material";
import { apiUpdateUser } from "../../services/user"; // Import API cập nhật user

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        phone: storedUser.phone,
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;

    try {
      await apiUpdateUser(userId, user); // Cập nhật thông tin người dùng qua API
      localStorage.setItem("user", JSON.stringify(user)); // Cập nhật lại localStorage
      setIsEditing(false); // Đóng chế độ chỉnh sửa sau khi lưu
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Cập nhật thông tin thất bại.");
    }
  };

  return (
    <div className="container">
        <div className="cartPage">
          <div className="profile-page">
            <h2>Thông tin cá nhân</h2>
      
            <div className="profile-info">
              <TextField
                label="Tên"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                margin="normal"
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                margin="normal"
              />
            </div>
      
            <div className="profile-actions">
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default UserProfile;
