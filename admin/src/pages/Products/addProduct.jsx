import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import { apiAddProduct, apiUpdateProduct, apiDeleteProduct } from '../../services/product';
import { apiAddProductImage } from '../../services/productImage';
import { apiGetAllBrand } from '../../services/brand';
import { apiGetAllCategories } from '../../services/category';
import { apiGetAllSubCategories } from '../../services/subCategory';
import { apiCreateProductSpecification, apiUpdateProductSpecification, apiDeleteProductSpecification, apiGetProductSpecifications } from '../../services/productSpecification';
import { FaDeleteLeft } from "react-icons/fa6";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, TextField } from '@mui/material';

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
    const [specifications, setSpecifications] = useState([]); // Add state for specifications

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [newSpecName, setNewSpecName] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [editingSpecId, setEditingSpecId] = useState(null); // State for editing specification

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

                // Fetch product specifications
                const specsResponse = await apiGetProductSpecifications(productId);
                setSpecifications(specsResponse.data || []); // Update specifications state

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

    const handleSaveSpecification = async () => {
        try {
            let response;
            if (isEditing) {
                // Cập nhật thông số kỹ thuật
                response = await apiUpdateProductSpecification(editingSpecId, { spec_key: newSpecName, spec_value: newSpecValue });
                if (response.err === 0) {
                    setSpecifications(prevSpecs =>
                        prevSpecs.map(spec =>
                            spec.id === editingSpecId ? { ...spec, spec_key: newSpecName, spec_value: newSpecValue } : spec
                        )
                    );
                } else {
                    throw new Error('Error updating specification: ' + response.message || 'Unknown error.');
                }
            } else {
                // Thêm thông số kỹ thuật mới
                response = await apiCreateProductSpecification({ spec_key: newSpecName, spec_value: newSpecValue });
                if (response.err === 0) {
                    setSpecifications(prevSpecs => [...prevSpecs, response.response]);
                } else {
                    throw new Error('Error adding specification: ' + response.message || 'Unknown error.');
                }
            }
            handleDialogClose();
        } catch (error) {
            console.error('Error saving specification:', error);
            alert('Error saving specification: ' + error.message);
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
                        <div className='col-md-6'>
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
                        <div className='col-md-6'>
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

                        {/* Brand */}
                        <div className='col-md-6'>
                            <h4>Brand</h4>
                            <FormControl fullWidth>
                                <Select
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                >
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Category */}
                        <div className='col-md-6'>
                            <h4>Category</h4>
                            <FormControl fullWidth>
                                <Select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Subcategory */}
                        <div className='col-md-6'>
                            <h4>Subcategory</h4>
                            <FormControl fullWidth>
                                <Select
                                    value={subCategoryId}
                                    onChange={(e) => setSubCategoryId(e.target.value)}
                                >
                                    {subCategories.map((subCategory) => (
                                        <MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Count in Stock */}
                        <div className='col-md-6'>
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
                        <div className='col-md-6'>
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
                        <div className='col-md-6'>
                            <h4>Is Featured</h4>
                            <div className='form-group'>
                                <input
                                    type='checkbox'
                                    className='input'
                                    name='isFeatured'
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                            </div>
                        </div>

                        {/* Discount */}
                        <div className='col-md-6'>
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
                            <h4>Product Images</h4>
                            <div className='form-group'>
                                <input
                                    type='file'
                                    className='input'
                                    multiple
                                    onChange={onChangeFile}
                                />
                            </div>
                            <div className='image-previews'>
                                {previews.map((preview, index) => (
                                    <div key={index} className='image-preview'>
                                        <img src={preview} alt={`preview-${index}`} />
                                        <button type="button" className="remove-img-btn" onClick={() => removeImg(index)}>
                                            <IoCloseSharp />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-12'>
                        <h4>Specifications</h4>
                        <table className="specification-table">
                            <tbody>
                                {specifications.map((spec, index) => (
                                    <tr key={index}>
                                        <th>{spec.name}</th>
                                        <td>{spec.value}</td>
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
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Add Product'}
                        </Button>
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

export default AddProduct;
// edited