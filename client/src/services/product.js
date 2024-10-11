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

  export const apiGetAllProductDetails2 = () =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "get",
          url: `/api/v1/product/all-details`, // Tạo endpoint mới trong server
        });
  
        // Kiểm tra nếu phản hồi thành công
        if (response && response.data) {
          resolve(response.data); // Trả về dữ liệu
        } else {
          reject(new Error("Unexpected response format"));
        }
      } catch (error) {
        reject(new Error(error.response?.data?.message || "Error fetching all product details"));
      }
    });
  


    export const apiGetProductsBySubCat = (subCatId, page = 1, limit = 10) => new Promise(async (resolve, reject) => {
      try {
          const response = await axiosConfig({
              method: 'get',
              url: `/api/v1/product/${subCatId}/by-subCat?page=${page}&limit=${limit}`,
          });
          resolve(response); // Đảm bảo trả về đúng dữ liệu từ API
      } catch (error) {
          console.error('Error fetching products by subcategory:', error.response || error.message || error);
          reject(error.response ? error.response.data : error.message || 'Unknown error');
      }
  });

  export const apiGetProductsByCat = (categoryId, page = 1, limit = 10) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/product/${categoryId}/by-category?page=${page}&limit=${limit}`,
        });
        resolve(response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        console.error('Error fetching products by category:', error.response || error.message || error);
        reject(error.response ? error.response.data : error.message || 'Unknown error');
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