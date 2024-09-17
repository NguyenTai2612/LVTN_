import axios from "axios";
import axiosConfig from "../axiosConfig";

export const apiGetProducts = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/product/all", // Điều chỉnh URL nếu cần
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetProductDetails = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/product/${productId}/details`, // Điều chỉnh URL nếu cần
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetProductsByCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/product/by-category`,
        params: { categoryId }, // Sử dụng `params` để gửi query string
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetProductsBySubCat = (subCatId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/product/${subCatId}/by-subCat`, // Adjust URL according to your backend endpoint
      });
      resolve(response); // Resolves with the data from the response
    } catch (error) {
      reject(error); // Rejects with error information
    }
  });

export const apiGetProductsByCat = (catId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/product/${catId}/by-category`, // Adjust URL according to your backend endpoint
      });
      resolve(response); // Resolves with the data from the response
    } catch (error) {
      reject(error); // Rejects with error information
    }
  });

export const apiGetProductsByCatFilter = async (catId, filters = {}) => {
  try {
    const response = await axiosConfig.get(`/api/v1/product/${catId}/filter`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};




export const incrementProductViews = async (productId) => {
    try {
      const response = await axiosConfig.put(`http://localhost:5000/api/v1/product/${productId}/views`);
      return response;  // Trả về dữ liệu từ server, nếu cần
    } catch (error) {
      console.error("Error incrementing product views:", error);
      throw error;  // Ném lỗi để xử lý ở nơi gọi hàm
    }
  };