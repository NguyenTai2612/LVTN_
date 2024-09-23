import axios from 'axios';

// Đặt URL cơ sở của API
const API_URL = 'http://localhost:5000/api/v1/childSubCategory'; // Thay đổi theo URL của bạn

// Lấy tất cả Child Sub Categories
export const apiGetAllChildSubCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Đảm bảo dữ liệu trả về theo đúng cấu trúc
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Lấy Child Sub Category theo ID
export const apiGetChildSubCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Đảm bảo dữ liệu trả về theo đúng cấu trúc
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Tạo Child Sub Category mới
export const apiCreateChildSubCategory = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data; // Đảm bảo dữ liệu trả về theo đúng cấu trúc
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Cập nhật Child Sub Category
export const apiUpdateChildSubCategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data; // Đảm bảo dữ liệu trả về theo đúng cấu trúc
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Xóa Child Sub Category
export const apiDeleteChildSubCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; // Đảm bảo dữ liệu trả về theo đúng cấu trúc
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Lấy tất cả Child Sub Categories theo Sub Category ID
export const apiGetAllChildSubCatBySubCatId = async (subCatId) => {
  try {
    const response = await axios.get(`${API_URL}/subCategory/${subCatId}`);
    return response.data; // Đảm bảo dữ liệu trả về theo đúng cấu trúc
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};
