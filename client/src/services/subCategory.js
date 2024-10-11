import axiosConfig from '../axiosConfig';

// Get all subcategories


export const apiGetSubCategories = (page = 1, limit = 3) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/subCategory/all?page=${page}&limit=${limit}`,
        });
        resolve(response.data.response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        reject(error);
    }
});

export const apiGetAllSubCategories = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/subcategory', // Adjust the URL path based on your API endpoint
        });
        resolve(response); // Ensure to return the correct data from the API
    } catch (error) {
        reject(error);
    }
});

// Get a subcategory by ID
export const apiGetSubCategoryById = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/subCategory/${id}`,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to fetch subcategory' });
    }
});



export const apiGetProductsByChildSubCategory = (childSubCatId, page = 1, limit = 10) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/product/${childSubCatId}/by-child-subcategory?page=${page}&limit=${limit}`,
        });
        resolve(response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        console.error('Error fetching products by child subcategory:', error.response || error.message || error);
        reject(error.response ? error.response.data : error.message || 'Unknown error');
    }
});

  export const apiGetAllSubCatsByChildSubCatId = (childSubCatId) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: 'get',
          url: `/api/v1/subCategory/${childSubCatId}/subcategories`,
        });
        resolve(response.data);
      } catch (error) {
        reject({ err: -1, msg: 'Failed to fetch subcategories by child subcategory ID' });
      }
    });
    
    export const apiGetCategoryByChildSubCatId = (childSubCatId) =>
        new Promise(async (resolve, reject) => {
          try {
            const response = await axiosConfig({
              method: 'get',
              url: `/api/v1/subCategory/child-subcategories/${childSubCatId}/category`,
            });
            resolve(response.data);
          } catch (error) {
            reject({ err: -1, msg: 'Failed to fetch category by child subcategory ID' });
          }
        });
      

export const getCategoryBySubCategoryId = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/subCategory/${id}/category`,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to fetch subcategory' });
    }
});

export const getAllSubCatByCatIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/subCategory/getAllSubCat-by-catId/${id}`,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to fetch subcategory' });
    }
});

export const apiGetChildSubCategoriesBySubCatId = (subCatId) => 
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: 'get',
          url: `/api/v1/subCategory/${subCatId}/child-subcategories`,
        });
        resolve(response);
      } catch (error) {
        reject({ err: -1, msg: 'Failed to fetch child subcategories' });
      }
  });

// Create a new subcategory
export const apiCreateSubCategory = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/subCategory',
            data,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to create subcategory' });
    }
});

// Update a subcategory by ID
export const apiUpdateSubCategory = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/subCategory/${id}`,
            data,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to update subcategory' });
    }
});

// Delete a subcategory by ID
export const apiDeleteSubCategory = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/subCategory/${id}`,
        });
        console.log('API response status:', response.status); // Log the status for debugging
        
        // Check for 200 status as well, assuming 200 indicates successful deletion
        if (response.status === 200 || response.status === 204) {
            resolve({ err: 0, msg: 'Subcategory deleted successfully' });
        } else {
            reject({ err: -1, msg: 'Failed to delete subcategory' });
        }
    } catch (error) {
        console.error('API request error:', error); // Log full error for debugging
        reject({ err: -1, msg: 'Failed to delete subcategory' });
    }
});

