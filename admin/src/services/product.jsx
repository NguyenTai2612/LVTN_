import axios from 'axios'
import axiosConfig from '../axiosConfig'

export const apiGetProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/product/all',  // Điều chỉnh URL nếu cần
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetProductDetails = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/product/${productId}/details`,  // Điều chỉnh URL nếu cần
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// export const apiAddProduct = (productData) => new Promise(async (resolve, reject) => {
//     try {
//       const response = await axiosConfig({
//         method: 'post',
//         url: '/api/v1/product/',
//         data: productData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       resolve(response.data);
//     } catch (error) {
//       reject(error);
//     }
//   });

export const apiAddProduct = (productData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/product/`,
            data: productData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

export const apiUpdateProduct = (productId, productData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/product/${productId}/update`,
            data: productData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});


export const apiDeleteProduct = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/product/${productId}`,  // Adjust URL if necessary
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});