// import axios from "axios";

// export const fetchDataFromApi = async (url) => {
//   try {
//     const { data } = await axios.get("http://localhost:4000" + url);

//     return data;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };
// //edit
// export const postData = async (url, formData) => {
//   try {
//     const response = await fetch(`http://localhost:4000${url}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     // Xử lý phản hồi từ API
//     if (response.ok) {
//       const data = await response.json();
//       return data;
//     } else {
//       // Nếu phản hồi không thành công, lấy dữ liệu lỗi từ phản hồi
//       const errorData = await response.json();
//       throw new Error(errorData.msg || "An error occurred");
//     }
//   } catch (error) {
//     console.error("Error posting data:", error);
//     // Trả về đối tượng lỗi nếu có
//     return { status: false, msg: error.message || "An error occurred during registration" };
//   }
// };


// export const editData = async (url, updatedData) => {
//   const { res } = await axios.put(`http://localhost:4000${url}`, updatedData);
//   return res;
// };

// export const deleteData = async (url) => {
//   const { res } = await axios.delete(`http://localhost:4000${url}`);
//   return res;
// };

// export const deleteImages = async (url) => {
//   const { res } = await axios.delete(`http://localhost:4000${url}`);
//   return res;
// };


import axios from "axios";



export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get("http://localhost:4000"+url);

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const postData = async (url, formData ) => {
    console.log(formData,url)
    const { res} = await axios.post("http://localhost:4000" + url, formData) 
    return res;  
}

export const editData = async (url, updatedData ) => {
    const { res } = await axios.put(`http://localhost:4000${url}`, updatedData);
    return res; 
}


export const deleteData = async (url ) => {
  const { res } = await axios.delete(`http://localhost:4000${url}`)
  return res;
}

export const deleteImages = async (url ) => {
  const { res } = await axios.delete(`http://localhost:4000${url}`)
  return res;
}