// services/review.js
import axiosConfig from "../axiosConfig";
import axios from 'axios';

// Lấy tất cả các đánh giá của sản phẩm
export const apiGetCurrent = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/user/get-current`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAllUsers = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/user`, // Đường dẫn đến API get all user
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

// Get user by id
export const apiGetUserById = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/user/${id}`, // Đường dẫn đến API get user by id
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

  export const apiVerifyPassword = (userId, currentPassword) =>
    axiosConfig({
      method: "post", // Sử dụng POST vì bạn đang gửi dữ liệu
      url: `/api/v1/user/verify-password`,
      data: { userId, currentPassword },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Đảm bảo có token
      }
    });
  

export const apiUpdateUser = (userId, userData) => {
    return axios.put(`/api/users/${userId}`, userData);
};

// Delete user by id
export const apiDeleteUser = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/api/v1/user/${id}`, // Đường dẫn đến API delete user by id
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
//editttttttttttt