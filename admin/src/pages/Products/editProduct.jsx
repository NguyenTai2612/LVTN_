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
    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState();
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
        if (!imgFiles) return

        let tmp = [];

        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }
        const objectUrls = tmp;
        setPreviews(objectUrls);
        //free memory
        for (let i = 0; i < objectUrls.length; i++) {

            return () => {
                URL.revokeObjectURL(objectUrls[i])
            }
        }
    }, [imgFiles])

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

    }, []);
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

    const formdata = new FormData()

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const imgArr = [];
            const files = e.target.files;
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileType = file.type;

                if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png') {
                    imgArr.push(file);
                    formData.append('images', file);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file.'
                    });
                    return; // Exit if an invalid file is encountered
                }
            }

            if (imgArr.length > 0) {
                setFiles(imgArr);
                setImgFiles(e.target.files);
                setIsSelectedFiles(true);
                setIsSelectedImages(true);
                console.log(imgArr);

                // Perform the upload
                await postData(apiEndPoint, formData);

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Images uploaded successfully!'
                });
            }
        } catch (error) {
            console.error(error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'An error occurred during file upload.'
            });
        }
    };

    const editProduct = (e) => {
        e.preventDefault()
        const specsArray = Object.entries(formFields.specifications).map(([key, value]) => ({
            key,
            value
        }));
        formdata.append('name', formFields.name);
        formdata.append('subCat', formFields.subCat);
        formdata.append('description', formFields.description);
        formdata.append('brand', formFields.brand);
        formdata.append('price', formFields.price);
        formdata.append('oldPrice', formFields.oldPrice);
        formdata.append('category', formFields.category);
        formdata.append('countInStock', formFields.countInStock);
        formdata.append('rating', formFields.rating);
        formdata.append('isFeatured', formFields.isFeatured);
        formdata.append('discount', formFields.discount);
        formdata.append('specifications', JSON.stringify(specsArray));

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



        setIsLoading(true)


        editData(`/api/products/${id}`, formFields).then((res) => {
            context.setAlertBox({
                open: true,
                msg: 'The product is update success!',
                error: false
            })

            setIsLoading(false)

            history('/product/list')


        })
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

                                                            <MenuItem className='text-capitalize' value={cat.id} key={index}>{cat.name}</MenuItem>
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
                                        <input type='text' value={formFields.price} className='input' name='price' onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Old Price</h4>
                                    <div className='form-group'>
                                        <input type='text' value={formFields.oldPrice} className='input' name='oldPrice' onChange={inputChange} />
                                    </div>
                                </div>

                                <div className='col-md-4 col_'>
                                    <h4>Product Stock</h4>
                                    <div className='form-group'>
                                        <input type='text' value={formFields.countInStock} className='input' name='countInStock' onChange={inputChange} />
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
                                previews?.length !== 0 && previews?.map((img, index) => {
                                    return (
                                        <div className='uploadBox' key={index}>
                                            {
                                                isSelectedImages === true ?
                                                    <img src={`${img}`} className="w-100" />
                                                    :
                                                    <img src={`${context.baseUrl}/uploads/${img}`} className="w-100" />
                                            }

                                        </div>
                                    )
                                })
                            }


                            <div className='uploadBox'>
                                <input type="file" multiple onChange={(e) => onChangeFile
                                    (e, '/api/products/upload')} name="images" />
                                <div className='info'>
                                    <FaRegImages />
                                    <h5>image upload</h5>
                                </div>
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



                <br />
                <br />
                <br />
            </form>
        </>
    )
}

export default EditProduct
