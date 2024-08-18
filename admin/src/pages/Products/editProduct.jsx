import React, { useContext, useEffect, useRef, useState } from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { FormControl, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { FaCloudUploadAlt, FaRegImages } from 'react-icons/fa';
import { editData, fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';

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

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const EditProduct = () => {
    const [uploading, setUploading] = useState(false);

    const [categoryVal, setCategoryVal] = useState('');
    const [ratingsValue, setRatingsValue] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [isFeaturedValue, setIsFeaturedValue] = useState('');
    const [productImagesArr, setProductImagesArr] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);
    const [isSelectedImages, setIsSelectedImages] = useState(false)
    const [subCatData, setSubCatData] = useState([]);
    const [currentSpecName, setCurrentSpecName] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [newSpecName, setNewSpecName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);


    const [files, setFiles] = useState([])
    const [product, setProduct] = useState([])
    const [imgFiles, setImgFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const history = useNavigate()

    let { id } = useParams()

    const [catData, setCatData] = useState([]);

    const context = useContext(MyContext)

    const [formFields, setFormFields] = useState({
        name: '',
        subCat: '',
        description: '',
        images: [],
        brand: '',
        price: null,
        oldPrice: null,
        subCatId: '',
        catName: '',
        category: '',
        countInStock: null,
        rating: 0,
        isFeatured: null,
        discount: 0,
        specifications: [] // Add specifications to state
    });
    const specificationsArray = Object.entries(formFields.specifications).map(([name, value]) => ({
        name,
        value
    }));

    const handleDialogClose = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setNewSpecName('');
        setNewSpecValue('');
    };

    useEffect(() => {
        if (!imgFiles.length) return;

        const objectUrls = imgFiles.map(file => URL.createObjectURL(file));
        setPreviews(objectUrls);

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imgFiles]);

    useEffect(() => {
        window.scrollTo(0, 0)
        context.setProgress(20)
        setCatData(context.catData)


        fetchDataFromApi(`/api/products/${id}`).then((res) => {

            setProduct(res);

            setFormFields({
                name: res.name,
                description: res.description,
                brand: res.brand,
                price: res.price,
                oldPrice: res.oldPrice,
                category: res.category,
                subCat: res.subCat,
                countInStock: res.countInStock,
                rating: res.rating,
                isFeatured: res.isFeatured,
                discount: res.discount,
                specifications: res.specifications
            });

            setRatingsValue(res.rating);
            setCategoryVal(res.category);
            setSubCategoryVal(res.subCat);
            setIsFeaturedValue(res.isFeatured);
            setPreviews(res.images);
            context.setProgress(100);

        });

    }, [id]);

    const handleAddSpecification = () => {
        setIsEditing(false);
        setOpenDialog(true);
    };
    const handleEditSpecification = (name, value) => {
        setCurrentSpecName(name);
        setNewSpecName(name);
        setNewSpecValue(value);
        setIsEditing(true);
        setOpenDialog(true);
    };


    const handleSaveSpecification = () => {
        const updatedSpecifications = { ...formFields.specifications };

        if (isEditing) {
            delete updatedSpecifications[currentSpecName]; // Remove the old key if the name has changed
        }

        updatedSpecifications[newSpecName] = newSpecValue;
        setFormFields({ ...formFields, specifications: updatedSpecifications });
        handleDialogClose();
    };

    const selectCat = (cat) => {
        formFields.catName = cat;
    }

    const handleDeleteSpecification = (name) => {
        const updatedSpecifications = { ...formFields.specifications };
        delete updatedSpecifications[name];
        setFormFields({ ...formFields, specifications: updatedSpecifications });
    };

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value)
        setFormFields(() => ({
            ...formFields,
            category: event.target.value
        }))
    }

    const handleChangeSubCategory = (event) => {
        setSubCategoryVal(event.target.value)
        setFormFields(() => ({
            ...formFields,
            subCat: event.target.value
        }))
        formFields.subCatId = event.target.value

    }

    const handleChangeIsFeaturedValue = (event) => {
        setIsFeaturedValue(event.target.value)
        setFormFields(() => ({
            ...formFields,
            isFeatured: event.target.value
        }))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const productImages = useRef()




    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }



    const onChangeFile = async (e, apiEndPoint) => {
        const files = e.target.files;
        setUploading(true);

        const formData = new FormData();
        const validImages = Array.from(files).filter(file =>
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
        );

        if (validImages.length !== files.length) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please select a valid JPG or PNG image file.',
            });
            setUploading(false);
            return;
        }

        validImages.forEach(file => formData.append('images', file));

        try {
            await postData(apiEndPoint, formData);
            setImgFiles(validImages);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Images uploaded successfully!',
            });
        } catch (error) {
            console.error('Upload Error:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to upload images.',
            });
        } finally {
            setUploading(false);
        }
    };
    const removeImg = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        URL.revokeObjectURL(previews[index]);
    };

    const editProduct = (e) => {
        e.preventDefault()

        const specsArray = Object.entries(formFields.specifications).map(([key, value]) => ({
            key,
            value
        }));

        const updatedData = new FormData();

        updatedData.append('name', formFields.name);
        updatedData.append('subCat', formFields.subCat);
        updatedData.append('description', formFields.description);
        updatedData.append('brand', formFields.brand);
        updatedData.append('price', formFields.price);
        updatedData.append('oldPrice', formFields.oldPrice);
        updatedData.append('subCatId', formFields.subCatId);
        updatedData.append('catName', formFields.catName);
        updatedData.append('category', formFields.category);
        updatedData.append('countInStock', formFields.countInStock);
        updatedData.append('rating', formFields.rating);
        updatedData.append('isFeatured', formFields.isFeatured);
        updatedData.append('discount', formFields.discount);
        updatedData.append('specifications', JSON.stringify(specsArray));
        if (imgFiles) {
            for (const file of imgFiles) {
                updatedData.append('images', file);
            }
        }
        if (formFields.name === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product name',
                error: true
            })
            return false
        }

        if (formFields.description === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product description',
                error: true
            })
            return false

        }

        if (formFields.brand === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product brand',
                error: true
            })
            return false

        }

        if (formFields.price === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product price',
                error: true
            })
            return false

        }

        if (formFields.oldPrice === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product oldPrice',
                error: true
            })
            return false

        }

        if (formFields.category === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please select a category',
                error: true
            })
            return false

        }

        if (formFields.subCat === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please select a sub category',
                error: true
            })
            return false

        }

        if (formFields.countInStock === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product countInStock',
                error: true
            })
            return false

        }

        if (formFields.rating === 0) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product rating',
                error: true
            })
            return false

        }

        if (formFields.isFeatured === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please select product isFeatured',
                error: true
            })
            return false

        }



        try {
            setIsLoading(true)


            editData(`/api/products/${id}`, formFields).then((res) => {
                context.setAlertBox({
                    open: true,
                    msg: 'The product is update success!',
                    error: false
                })


                history('/product/list')


            })
        } catch (error) {
            console.error(error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to update product',
            });
        } finally {
            setIsLoading(false);
        }
    }

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

            <form className='form w-[100%] mt-4' style={{ width: '100%' }} onSubmit={editProduct}>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card shadow my-4 border-0 flex-center p-3'>
                            <h2 className='font-weight-bold text-black/70 mb-4'>Basic Information</h2>
                            <div className='row'>
                                <div className='col-md-12 col_'>
                                    <h4>Product Name</h4>
                                    <div className='form-group'>
                                        <input type='text' className='input' name='name' value={formFields.name} onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-12 col_'>
                                    <h4>Product Description</h4>
                                    <div className='form-group'>
                                        <textarea className='input' name='description' value={formFields.description} onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Category</h4>
                                    <div className='form-group'>
                                        <FormControl size="small" className="w-100">
                                            <Select
                                                value={categoryVal}
                                                onChange={handleChangeCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100">
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                {
                                                    context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                                        return (

                                                            <MenuItem className='text-capitalize' value={cat.id} key={index}
                                                                onClick={() => selectCat(cat.name)}
                                                            >{cat.name}</MenuItem>
                                                        )
                                                    })
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Sub Category</h4>
                                    <div className='form-group'>
                                        <FormControl size="small" className="w-100">
                                            <Select
                                                value={subCategoryVal}
                                                onChange={handleChangeSubCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100">
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                {
                                                    context.subCatData?.subCategoryList?.length !== 0 && context.subCatData?.subCategoryList?.map((subCat, index) => {
                                                        return (

                                                            <MenuItem className='text-capitalize' value={subCat.id} key={index}>{subCat.subCat}</MenuItem>
                                                        )
                                                    })
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Is Featured</h4>
                                    <div className='form-group'>
                                        <FormControl size="small" className="w-100">
                                            <Select
                                                value={isFeaturedValue}
                                                onChange={handleChangeIsFeaturedValue}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                labelId="demo-select-small-label"
                                                className="w-100">
                                                <MenuItem value=""> <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                            </div>

                            <div className='row'>
                                <div className='col-md-4 col_'>
                                    <h4>Price</h4>
                                    <div className='form-group'>
                                        <input type='number' value={formFields.price} className='input' name='price' onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Old Price</h4>
                                    <div className='form-group'>
                                        <input type='number' value={formFields.oldPrice} className='input' name='oldPrice' onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Product Stock</h4>
                                    <div className='form-group'>
                                        <input type='number' value={formFields.countInStock} className='input' name='countInStock' onChange={inputChange} />
                                    </div>
                                </div>


                            </div>

                            <div className='row'>



                                <div className='col-md-4 col_'>
                                    <h4>Brand</h4>
                                    <div className='form-group'>
                                        <input type='text'
                                            value={formFields.brand} className='input' name='brand' onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Discount</h4>
                                    <div className='form-group'>
                                        <input type='number' className='input' name='discount' value={formFields.discount || ''} onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Rating</h4>
                                    <div className='form-group'>
                                        <Rating
                                            name='read-only'
                                            value={ratingsValue}
                                            size='small'
                                            precision={0.5}
                                            onChange={(event, newValue) => {
                                                setRatingsValue(newValue)
                                                setFormFields(() => ({
                                                    ...formFields,
                                                    rating: newValue
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>



                            <div className='row'>
                                <div className='col-md-12 col_ specifications-container'>
                                    <h4>Specifications</h4>
                                    <table className="specification-table">
                                        <tbody>
                                            {Object.entries(formFields.specifications).map(([key, value], index) => (
                                                <tr key={index}>
                                                    <th>{key}</th>
                                                    <td>{value}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="edit-specification-btn "
                                                            onClick={() => handleEditSpecification(key, value)}
                                                        >
                                                            <CiEdit />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="delete-specification-btn ml-3"
                                                            onClick={() => handleDeleteSpecification(key)}
                                                        >
                                                            <FaDeleteLeft />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button type="button" className="add-specification-btn" onClick={handleAddSpecification}>
                                        Add Specification
                                    </button>

                                    <Dialog open={openDialog} onClose={handleDialogClose}>
                                        <DialogTitle>{isEditing ? 'Edit Specification' : 'Add Specification'}</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                label="Specification Name"
                                                fullWidth
                                                variant="outlined"
                                                value={newSpecName}
                                                onChange={(e) => setNewSpecName(e.target.value)}
                                            />
                                            <TextField
                                                margin="dense"
                                                label="Specification Value"
                                                fullWidth
                                                variant="outlined"
                                                value={newSpecValue}
                                                onChange={(e) => setNewSpecValue(e.target.value)}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleDialogClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSaveSpecification} color="primary">
                                                Save
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </div>






                        </div>


                    </div>




                </div>

                <div className='card shadow my-4 border-0 flex-center p-3'>
                    <div className='imagesUploadSec'>

                        <h5 className='mb-4 font-weight-bold'>Media And Published</h5>
                        <div className='imgUploadBox d-flex align-items-center'>
                            {
                                previews.length > 0 && previews.map((img, index) => (
                                    <div className='uploadBox' key={index}>
                                        <span className="remove" onClick={() => removeImg(index)}>
                                            <IoCloseSharp />
                                        </span>
                                        <div className='box'>
                                            <img src={img} className="w-100" alt="Category Preview" />
                                        </div>
                                    </div>
                                ))
                            }

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
                                            onChange={(e) => onChangeFile(e, '/api/products/upload')}
                                            name="images"
                                        />
                                        <div className='info'>
                                            <FaRegImages />
                                            <h5>Image Upload</h5>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <br />
                        <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                            <FaCloudUploadAlt /> &nbsp;
                            {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                        </Button>
                    </div>
                </div>



                <br />
                <br />
                <br />
            </form>
        </>
    )
}

export default EditProduct