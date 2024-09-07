import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import { apiAddProduct } from '../../services/product';
import { apiAddProductImage } from '../../services/productImage'; // Import the API service for images
import { apiGetAllBrand } from '../../services/brand';
import { apiGetAllCategories } from '../../services/category';
import { apiGetAllSubCategories } from '../../services/subCategory';

const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dilsy0sqq/image/upload';

const AddProduct = () => {
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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsData, categoriesData, subCategoriesData] = await Promise.all([
                    apiGetAllBrand(),
                    apiGetAllCategories(),
                    apiGetAllSubCategories()
                ]);

                setBrands(brandsData || []);
                setCategories(categoriesData || []);
                setSubCategories(subCategoriesData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data.');
            }
        };

        fetchData();
    }, []);

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

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('oldPrice', oldPrice);
            formData.append('brand_id', brandId);
            formData.append('category_id', categoryId);
            formData.append('sub_category_id', subCategoryId);
            formData.append('countInStock', countInStock);
            formData.append('rating', rating);
            formData.append('isFeatured', isFeatured);
            formData.append('discount', discount);
    
            // Collect image URLs
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
    
            // Create product
            const productResponse = await apiAddProduct(formData);
    
            if (productResponse.err === 0) {
                const productId = productResponse.response.id;  // Get the newly created product ID
                
                // Add product images
                for (let url of imageUrls) {
                    await apiAddProductImage(productId, { imageUrl: url });
                }
    
                navigate('/product/list');
            } else {
                alert(productResponse.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding product.');
        } finally {
            setIsLoading(false);
        }
    };
    
    

    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3'>
                <h1 className='font-weight-bold'>Add Product</h1>
            </div>

            <form className='form w-[100%] mt-4' onSubmit={handleSubmit} style={{ width: '75%' }}>
                <div className='card shadow my-4 border-0 flex-center p-3'>
                    <div className='row'>
                        {/* Product Name */}
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

                        {/* Count in Stock */}
                        <div className='col-md-12'>
                            <h4>Count in Stock</h4>
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
                                    className='input'
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

                        {/* Image Upload */}
                        <div className='col-md-12'>
                            <h4>Images</h4>
                            <div className='form-group'>
                                <input
                                    type='file'
                                    className='input'
                                    name='images'
                                    onChange={onChangeFile}
                                    multiple
                                />
                                <div className='mt-3'>
                                    {previews.map((preview, index) => (
                                        <div key={index} className='relative inline-block mr-3 mb-3'>
                                            <img
                                                src={preview}
                                                alt='Preview'
                                                className='h-24 w-24 object-cover rounded-md'
                                            />
                                            <button
                                                type='button'
                                                className='absolute top-0 right-0 text-white bg-black rounded-full p-1'
                                                onClick={() => removeImg(index)}
                                            >
                                                <IoCloseSharp />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='col-md-12'>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                startIcon={<FaCloudUploadAlt />}
                                disabled={isLoading || uploading}
                                className='w-full mt-4'
                            >
                                {isLoading ? (
                                    <>
                                        <CircularProgress size={24} className='mr-2' /> Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddProduct;
