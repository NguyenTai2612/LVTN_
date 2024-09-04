import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import { apiGetCategoryById, apiUpdateCategory } from '../../services/category';
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dilsy0sqq/image/upload`;

const EditCategory = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [imgFiles, setImgFiles] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const history = useNavigate();

    // Fetch category data by ID
    useEffect(() => {
      const fetchCategory = async () => {
          try {
              const response = await apiGetCategoryById(id);
              console.log('Fetch Category Response:', response); // Debugging

              // Check if the response contains error
              if (response.err === 0) {
                  setName(response.response.name);
                  setCurrentImage(response.response.image || '');
                  setPreviews(response.response.image ? [response.response.image] : []);
              } else {
                  console.error('API Error:', response); // Debugging
                  alert(response.msg || 'Failed to fetch category.');
              }
          } catch (error) {
              console.error('Error fetching category:', error);
              alert('There was an error fetching the category details.');
          } finally {
              setIsLoading(false);
          }
      };

      fetchCategory();
  }, [id]);

    // Handle file input change
    const onChangeFile = (e) => {
        const files = Array.from(e.target.files);
        setImgFiles(files);

        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    // Remove image from preview
    const removeImg = (index) => {
        const newFiles = [...imgFiles];
        newFiles.splice(index, 1);
        setImgFiles(newFiles);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    // Handle input change for category name
    const changeInput = (e) => {
        setName(e.target.value);
    };

    // Handle form submission
    const updateCategory = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
          const formData = new FormData();
          formData.append('name', name);
  
          if (imgFiles && imgFiles.length > 0) {
              setUploading(true);
  
              const imageData = new FormData();
              imageData.append('file', imgFiles[0]);
              imageData.append('upload_preset', 'web_nhac');
  
              const cloudinaryRes = await fetch(cloudinaryUrl, {
                  method: 'POST',
                  body: imageData,
              });
  
              const cloudinaryData = await cloudinaryRes.json();
  
              console.log('Cloudinary Response:', cloudinaryData); // Debugging
  
              if (cloudinaryData.secure_url) {
                  formData.append('image_url', cloudinaryData.secure_url); // Add the image URL
              } else {
                  throw new Error(cloudinaryData.error.message);
              }
  
              setUploading(false);
          } else {
              if (currentImage) {
                  formData.append('image_url', currentImage); // Use existing image URL
              } else {
                  throw new Error('No image provided');
              }
          }
  
          const response = await apiUpdateCategory(id, formData);
  
          console.log('Update Category Response:', response); // Debugging
  
          // Detailed Logging
          if (response.err === 0) {
              console.log('Category updated successfully');
              history('/category');
          } else {
              console.error('Failed to update category:', response);
              alert(response.msg || 'Failed to update category.');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('There was an error updating the category.');
      } finally {
          setIsLoading(false);
      }
  };
  
  
  

    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3'>
                <h1 className='font-weight-bold'>Edit Category</h1>
            </div>

            <form className='form w-[100%] mt-4' onSubmit={updateCategory} style={{ width: '75%' }}>
                <div className='card shadow my-4 border-0 flex-center p-3'>
                    <div className='row'>
                        <div className='col-md-12 col_'>
                            <h4>Category Name</h4>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    className='input'
                                    name='name'
                                    onChange={changeInput}
                                    value={name}
                                />
                            </div>
                        </div>

                        <div className='col-md-12 col_'>
                            <h5 className='mb-4 font-weight-bold'>Media And Published</h5>

                            <div className='imgUploadBox d-flex align-items-center'>
                                {previews.map((img, index) => (
                                    <div className='uploadBox' key={index}>
                                        <span className="remove" onClick={() => removeImg(index)}>
                                            <IoCloseSharp />
                                        </span>
                                        <div className='box'>
                                            <img src={img} className="w-100" alt="Preview" />
                                        </div>
                                    </div>
                                ))}

                                <div className='uploadBox'>
                                    {uploading ?
                                        <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                            <CircularProgress />
                                            <span>Uploading...</span>
                                        </div>
                                        :
                                        <>
                                            <input
                                                type="file"
                                                multiple
                                                name="images"
                                                onChange={onChangeFile}
                                            />
                                            <div className='info'>
                                                <FaCloudUploadAlt />
                                                <h5>Image Upload</h5>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                            {isLoading ? <CircularProgress color="inherit" /> : 'UPDATE AND VIEW'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditCategory;
// show cat success