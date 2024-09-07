import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import {
    apiGetProductDetails,
    apiUpdateProduct,
    apiGetAllBrand,
    apiGetAllCategories,
    apiGetAllSubCategories,
    apiGetProductImages,
    apiAddProductImage,
    apiDeleteProductImage
} from '../../services/index'; // Import các API services cần thiết
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dilsy0sqq/image/upload';

import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { apiCreateProductSpecification, apiUpdateProductSpecification, apiDeleteProductSpecification, apiGetProductSpecifications } from '../../services/productSpecification';
import { FaDeleteLeft } from "react-icons/fa6";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [brandId, setBrandId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [rating, setRating] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [discount, setDiscount] = useState('');
    const [imgFiles, setImgFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);


    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [specifications, setSpecifications] = useState([]);
    const [newSpecName, setNewSpecName] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [editingSpecId, setEditingSpecId] = useState(null);

   

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product details
                const productResponse = await apiGetProductDetails(id);
                const productData = productResponse.data.response;

                // Fetch all brands, categories, and subCategories
                const [brandsResponse, categoriesResponse, subCategoriesResponse] = await Promise.all([
                    apiGetAllBrand(),
                    apiGetAllCategories(),
                    apiGetAllSubCategories()
                ]);

                setBrands(brandsResponse || []);
                setCategories(categoriesResponse || []);
                setSubCategories(subCategoriesResponse || []);

                // Set the product details state
                setName(productData.name);
                setDescription(productData.description);
                setPrice(productData.price);
                setOldPrice(productData.oldPrice);
                setBrandId(productData.brand_id);
                setCategoryId(productData.category_id);
                setSubCategoryId(productData.sub_category_id);
                setCountInStock(productData.countInStock);
                setRating(productData.rating);
                setIsFeatured(productData.isFeatured);
                setDiscount(productData.discount);

                // Fetch existing images
                const imagesResponse = await apiGetProductImages(id);
                setExistingImages(imagesResponse.images || []); // Ensure we get both id and imageUrl
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data.');
            }
        };

        fetchData();
    }, [id]);

    const onChangeFile = (e) => {
        const files = Array.from(e.target.files);
        setImgFiles(files);

        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    const removeImg = (index) => {
        const newFiles = [...imgFiles];
        newFiles.splice(index, 1);
        setImgFiles(newFiles);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleDeleteImage = async (imageId) => {
        try {
            const response = await apiDeleteProductImage(imageId);
            if (response.err === 0) {
                // Cập nhật danh sách hình ảnh sau khi xóa thành công
                setExistingImages(existingImages.filter(image => image.id !== imageId));
            } else {
                alert(response.msg || 'Error deleting image.');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !price || !countInStock) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('oldPrice', oldPrice || '');
        formData.append('countInStock', countInStock);
        formData.append('rating', rating || '');
        formData.append('isFeatured', isFeatured ? 'true' : 'false');
        formData.append('discount', discount || '');
        formData.append('brand_id', brandId);
        formData.append('category_id', categoryId);
        formData.append('sub_category_id', subCategoryId);

        let imageUrls = [];
        if (imgFiles.length > 0) {
            setUploading(true);

            for (let i = 0; i < imgFiles.length; i++) {
                const imageData = new FormData();
                imageData.append('file', imgFiles[i]);
                imageData.append('upload_preset', 'web_nhac');

                const cloudinaryRes = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: imageData,
                });

                const cloudinaryData = await cloudinaryRes.json();

                if (cloudinaryData.secure_url) {
                    imageUrls.push(cloudinaryData.secure_url);
                } else {
                    throw new Error(cloudinaryData.error.message);
                }
            }

            setUploading(false);
        }

        try {
            setIsLoading(true);
            const productResponse = await apiUpdateProduct(id, formData);

            const productId = productResponse.id || id;  // Sử dụng productId từ response hoặc id ban đầu

            console.log(productResponse);

            if (productResponse.err === 0) {
                // Không cần khai báo lại productId ở đây
                for (let url of imageUrls) {
                    await apiAddProductImage(productId, { imageUrl: url });
                }

               

                navigate('/product/list');
            } else {
                alert(productResponse.msg);
            }

            navigate(`/product/list`);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product.');
        } finally {
            setIsLoading(false);
        }

    };

    const handleEditSpecification = (id, name, value) => {
        setIsEditing(true);
        setOpenDialog(true);
        setEditingSpecId(id); // Set the id of the specification being edited
        setNewSpecName(name);
        setNewSpecValue(value);
    };

    const handleDeleteSpecification = async (id) => {
        try {
            await apiDeleteProductSpecification(id);
            setSpecifications(prevSpecs => prevSpecs.filter(spec => spec.id !== id));
        } catch (error) {
            console.error('Error deleting specification:', error);
            alert('Error deleting specification.');
        }
    };

    const handleAddSpecification = () => {
        setIsEditing(false);
        setOpenDialog(true);
        setNewSpecName('');
        setNewSpecValue('');
    };

    const handleDialogClose = () => {
        setIsEditing(false);
        setOpenDialog(false);
    };
    
    const fetchSpecifications = async () => {
        if (id) {
            try {
                const response = await apiGetProductSpecifications(id);
                console.log('API response for specifications:', response); // Log API response
                if (response.err === 0) {
                    setSpecifications(response.response);
                    console.log('Set specifications:', response.response); // Log after setting state
                } else {
                    console.error('Failed to fetch specifications:', response.message);
                }
            } catch (error) {
                console.error('Error fetching specifications:', error);
            }
        }
    };

    const handleSaveSpecification = async () => {
        try {
            let response;
            const specData = { spec_key: newSpecName, spec_value: newSpecValue };
            if (isEditing) {
                response = await apiUpdateProductSpecification(editingSpecId, specData);
                if (response.err === 0) {
                    setSpecifications(prevSpecs =>
                        prevSpecs.map(spec =>
                            spec.id === editingSpecId ? { ...spec, spec_key: newSpecName, spec_value: newSpecValue } : spec
                        )
                    );
                } else {
                    throw new Error(response.message || 'Unknown error.');
                }
            } else {
                response = await apiCreateProductSpecification(id, specData); // Truyền productId vào đây
                if (response.err === 0) {
                    setSpecifications(prevSpecs => [...prevSpecs, response]);
                    fetchSpecifications();
                } else {
                    throw new Error(response.message || 'Unknown error.');
                }
            }
            handleDialogClose();
        } catch (error) {
            console.error('Error saving specification:', error);
            alert('Error saving specification: ' + (error.message || 'Unknown error.'));
        }
    };
    
    useEffect(() => {   

        fetchSpecifications();
    }, [id]);

  

    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3'>
                <h1 className='font-weight-bold'>Edit Product</h1>
            </div>

            <form className='form w-[100%] mt-4' onSubmit={handleSubmit} style={{ width: '75%' }}>
                <div className='card shadow my-4 border-0 flex-center p-3'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h4>Product Name</h4>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    className='input'
                                    name='name'
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className='col-md-12'>
                            <h4>Description</h4>
                            <div className='form-group'>
                                <textarea
                                    className='input'
                                    name='description'
                                    rows='5'
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                ></textarea>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='col-md-12'>
                            <h4>Price</h4>
                            <div className='form-group'>
                                <input
                                    type='number'
                                    className='input'
                                    name='price'
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                />
                            </div>
                        </div>

                        {/* Old Price */}
                        <div className='col-md-12'>
                            <h4>Old Price</h4>
                            <div className='form-group'>
                                <input
                                    type='number'
                                    className='input'
                                    name='oldPrice'
                                    onChange={(e) => setOldPrice(e.target.value)}
                                    value={oldPrice}
                                />
                            </div>
                        </div>

                        {/* Brand ID */}
                        <div className='col-md-12'>
                            <h4>Brand</h4>
                            <div className='form-group'>
                                <select
                                    className='input'
                                    name='brand_id'
                                    onChange={(e) => setBrandId(e.target.value)}
                                    value={brandId}
                                >
                                    <option value=''>Select Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Category ID */}
                        <div className='col-md-12'>
                            <h4>Category</h4>
                            <div className='form-group'>
                                <select
                                    className='input'
                                    name='category_id'
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    value={categoryId}
                                >
                                    <option value=''>Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sub-Category ID */}
                        <div className='col-md-12'>
                            <h4>Sub-Category</h4>
                            <div className='form-group'>
                                <select
                                    className='input'
                                    name='sub_category_id'
                                    onChange={(e) => setSubCategoryId(e.target.value)}
                                    value={subCategoryId}
                                >
                                    <option value=''>Select Sub-Category</option>
                                    {subCategories.map((subCategory) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                            {subCategory.subCat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Count In Stock */}
                        <div className='col-md-12'>
                            <h4>Count In Stock</h4>
                            <div className='form-group'>
                                <input
                                    type='number'
                                    className='input'
                                    name='countInStock'
                                    onChange={(e) => setCountInStock(e.target.value)}
                                    value={countInStock}
                                />
                            </div>
                        </div>

                        {/* Rating */}
                        <div className='col-md-12'>
                            <h4>Rating</h4>
                            <div className='form-group'>
                                <input
                                    type='number'
                                    className='input'
                                    name='rating'
                                    onChange={(e) => setRating(e.target.value)}
                                    value={rating}
                                />
                            </div>
                        </div>

                        {/* Is Featured */}
                        <div className='col-md-12'>
                            <h4>Featured</h4>
                            <div className='form-group'>
                                <input
                                    type='checkbox'
                                    name='isFeatured'
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    checked={isFeatured}
                                />
                            </div>
                        </div>

                        {/* Discount */}
                        <div className='col-md-12'>
                            <h4>Discount</h4>
                            <div className='form-group'>
                                <input
                                    type='number'
                                    className='input'
                                    name='discount'
                                    onChange={(e) => setDiscount(e.target.value)}
                                    value={discount}
                                />
                            </div>
                        </div>

                        {/* Upload Images */}
                        <div className='col-md-12'>
                            <h4>Upload Images</h4>
                            <div className='form-group'>
                                <input
                                    type='file'
                                    className='input'
                                    multiple
                                    onChange={onChangeFile}
                                />
                                <div className='mt-3'>
                                    {previews.map((url, index) => (
                                        <div key={index} className='d-inline-block mr-2 position-relative'>
                                            <img src={url} alt={`preview-${index}`} style={{ width: '100px', height: '100px' }} />
                                            <button
                                                type='button'
                                                className='btn btn-danger position-absolute'
                                                style={{ top: '0', right: '0' }}
                                                onClick={() => removeImg(index)}
                                            >
                                                <IoCloseSharp />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className='mt-3'>
                                    {existingImages.map((image) => (
                                        <div key={image.id} className='d-inline-block mr-2 position-relative'>
                                            <img src={image.imageUrl} alt={`existing-${image.id}`} style={{ width: '100px', height: '100px' }} />
                                            <button
                                                type='button'
                                                className='btn btn-danger position-absolute'
                                                style={{ top: '0', right: '0' }}
                                                onClick={() => handleDeleteImage(image.id)}
                                            >
                                                <IoCloseSharp />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <div className='col-md-12'>
                            <h4>Specifications</h4>
                            <table className="specification-table">
                                <tbody>
                                    {specifications.map((spec) => (
                                        <tr key={spec.id}>
                                            <th>{spec.spec_key}</th>
                                            <td>{spec.spec_value}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="edit-specification-btn"
                                                    onClick={() => handleEditSpecification(spec.id, spec.name, spec.value)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="delete-specification-btn"
                                                    onClick={() => handleDeleteSpecification(spec.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddSpecification}
                            >
                                Add Specification
                            </Button>
                        </div>



                        {/* Submit Button */}
                        <div className='col-md-12 mt-4'>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </div>
                    </div>


                </div>
            </form>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{isEditing ? 'Edit Specification' : 'Add Specification'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Specification Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newSpecName}
                        onChange={(e) => setNewSpecName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Specification Value"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSaveSpecification}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default EditProduct;
