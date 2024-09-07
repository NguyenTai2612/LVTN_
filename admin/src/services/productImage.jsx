import axiosConfig from '../axiosConfig';

// Fetch product images by product ID
export const apiGetProductImages = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/productImage/${productId}/images`,
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// Add images to a product
export const apiAddProductImage = (productId, imageData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/productImage`,
            data: {
                productId: productId, // Ensure productId is included
                ...imageData        // Spread imageData to include imageUrl
            },
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});


// Update an existing image for a product
export const apiUpdateProductImage = (imageId, imageData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/productImage/${imageId}`,
            data: imageData,
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// Delete an image for a product
export const apiDeleteProductImage = (imageId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/productImage/${imageId}`,
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});
