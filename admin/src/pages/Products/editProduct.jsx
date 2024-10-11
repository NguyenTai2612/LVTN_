import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    apiDeleteProductImage,
    apiGetAllChildSubCategories
} from '../../services/index'; // Import các API services cần thiết
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dilsy0sqq/image/upload';
import { apiCreateProductSpecification, apiUpdateProductSpecification, apiDeleteProductSpecification, apiGetProductSpecifications } from '../../services/productSpecification';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Rating, Select, TextField } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import { emphasize, styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

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
    const [childSubCategoryId, setChildSubCategoryId] = useState('');
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
    const [childSubCategories, setChildSubCategories] = useState([]);
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
                const [brandsResponse, categoriesResponse, subCategoriesResponse, childSubCategoriesData] = await Promise.all([
                    apiGetAllBrand(),
                    apiGetAllCategories(),
                    apiGetAllSubCategories(),
                    apiGetAllChildSubCategories()
                ]);

                setBrands(brandsResponse || []);
                setCategories(categoriesResponse || []);
                setSubCategories(subCategoriesResponse || []);
                setChildSubCategories(childSubCategoriesData.response || []);
console.log('childSubCategoriesData',childSubCategoriesData)

                // Set the product details state
                setName(productData.name);
                setDescription(productData.description);
                setPrice(productData.price);
                setOldPrice(productData.oldPrice);
                setBrandId(productData.brand_id);
                setCategoryId(productData.category_id);
                setSubCategoryId(productData.sub_category_id);
                setChildSubCategoryId(productData.child_sub_category_id);
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

        if (!name || !price ) {
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
        formData.append('child_sub_category_id', childSubCategoryId);

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
        setNewSpecName(name); // Set the existing name to the input field
        setNewSpecValue(value); // Set the existing value to the input field
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
                console.log('API response for specifications:', response);
    
                if (response.data.err === 0) {
                    setSpecifications(response.data.response);  // Lưu dữ liệu vào state
                    console.log('Set specifications:', response.data.response);
                } else {
                    console.error('Failed to fetch specifications:', response.data.message);
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
                console.log('Update Response:', response); // Log phản hồi từ API
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
                response = await apiCreateProductSpecification(id, specData);
                console.log('Create Response:', response); // Log phản hồi từ API
                if (response.err === 0) {
                    setSpecifications(prevSpecs => [...prevSpecs, response.response]); // Đảm bảo phản hồi có trường 'response'
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
            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'> Edit Product</h1>

                    <div className='ml-auto flex items-center gap-3'>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component={Link} href="#" label="Product" to='http://localhost:5173/product/list' />

                            <StyledBreadcrumb
                                label="Edit Product"
                            />
                        </Breadcrumbs>
                    </div>
                </div>
            </div>

            <form className='form w-[100%] mt-4' style={{ width: '100%' }} onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card shadow my-4 border-0 flex-center p-3'>
                            <h2 className='font-weight-bold text-black/70 mb-4'>Basic Information</h2>

                            <div className='row'>
                                <div className='col-md-12 col_'>
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

                                <div className='col-md-12 col_'>
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

                                <div className='col-md-4 col_'>
                                    <h4>Category</h4>
                                    <div className='form-group'>
                                        <FormControl fullWidth size="small" className="w-100">
                                            <Select
                                                value={categoryId}
                                                onChange={(e) => setCategoryId(e.target.value)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100"
                                            >
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                {categories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Sub Category</h4>
                                    <div className='form-group'>
                                        <FormControl fullWidth size="small" className="w-100">
                                            <Select
                                                value={subCategoryId}
                                                onChange={(e) => setSubCategoryId(e.target.value)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100"
                                            >
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                {subCategories.map((subCategory) => (
                                                    <MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.subCat}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Child Sub Category</h4>
                                    <div className='form-group'>
                                        <FormControl fullWidth size="small" className="w-100">
                                            <Select
                                                value={childSubCategoryId}
                                                onChange={(e) => setChildSubCategoryId(e.target.value)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100"
                                            >
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                {childSubCategories.map((childSubCategory) => (
                                                    <MenuItem key={childSubCategory.id} value={childSubCategory.id}>{childSubCategory.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Brand</h4>
                                    <div className='form-group'>
                                        <FormControl fullWidth size="small" className="w-100">
                                            <Select
                                                value={brandId}
                                                onChange={(e) => setBrandId(e.target.value)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100"
                                            >
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                {brands.map((brand) => (
                                                    <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-4 col_'>
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

                                <div className='col-md-4 col_'>
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

                                <div className='col-md-4 col_'>
                                    <h4>Count in Stock</h4>
                                    <div className='form-group'>
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
                                </div>

                            </div>

                            <div className='row'>

                                <div className='col-md-4 col_'>
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

                                <div className='col-md-4 col_'>
                                    <h4>Rating</h4>
                                    <div className='form-group'>
                                        <Rating
                                            value={rating}
                                            size='small'
                                            precision={0.5}
                                            name='rating'
                                            onChange={(e) => setRating(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
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

                            </div>


                        </div>
                    </div>
                </div>

                <div className='card shadow border-0 flex-center p-3'>
                    <div className='imagesUploadSec'>
                        <div className='col-md-12 col_ specifications-container'>
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
                                                    onClick={() => handleEditSpecification(spec.id, spec.spec_key, spec.spec_value)}
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
                            <button type="button" className="add-specification-btn" onClick={handleAddSpecification}>
                                Add Specification
                            </button>

                        </div>
                    </div>
                </div>

                <div className='card shadow my-4 border-0 flex-center p-3'>
                    <div className='imagesUploadSec'>

                        <h5 className='mb-4 font-weight-bold'>Media And Published</h5>

                        <div className='imgUploadBox d-flex align-items-center'>

                            {/* Preview of new images */}
                            {previews.map((url, index) => (
                                <div key={index} className='uploadBox'>
                                    <span className='remove' onClick={() => removeImg(index)}>
                                        <IoCloseSharp />
                                    </span>
                                    <div className='box'>
                                        <img src={url} className='w-100' alt={`preview-${index}`} />
                                    </div>
                                </div>
                            ))}

                            {/* Existing images */}
                            {existingImages.map((image) => (
                                <div key={image.id} className='uploadBox'>
                                    <span className='remove' onClick={() => handleDeleteImage(image.id)}>
                                        <IoCloseSharp />
                                    </span>
                                    <div className='box'>
                                        <img src={image.imageUrl} className='w-100' alt={`existing-${image.id}`} />
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
                                            className="uploadInput"
                                        />
                                        <div className='info'>
                                            <FaCloudUploadAlt />
                                            <h5>Image Upload</h5>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <br />
                        <Button type="submit" className="btn-blue btn-lg btn-big w-100"

                        ><FaCloudUploadAlt /> &nbsp;
                            {
                                isLoading === true ?
                                    <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'
                            }</Button>

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
//edit