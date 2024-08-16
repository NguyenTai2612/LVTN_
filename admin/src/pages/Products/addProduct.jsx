import React, { useContext, useEffect, useRef, useState } from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { FaCloudUploadAlt, FaRegImages } from 'react-icons/fa';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from 'react-router-dom'
import { CiEdit } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

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

const ProductUpload = () => {

    const [categoryVal, setCategoryVal] = useState('');
    const [ratingsValue, setRatingsValue] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [isFeaturedValue, setIsFeaturedValue] = useState('');
    const [productImagesArr, setProductImagesArr] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);

    const [files, setFiles] = useState([])
    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState([]);
    const history = useNavigate()
    const [uploading, setUploading] = useState(false)


    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);

    const context = useContext(MyContext)
    const formData = new FormData();

    const [formFields, setFormFields] = useState({
        name: '',
        subCat: '',
        description: '',
        images: [],
        brand: '',
        price: null,
        oldPrice: null,
        catName: '',
        category: '',
        countInStock: null,
        rating: 0,
        isFeatured: null,
        discount: 0,
        specifications: {}
    });

    const handleDeleteSpecification = (name) => {
        const updatedSpecifications = { ...formFields.specifications };
        delete updatedSpecifications[name];
        setFormFields({ ...formFields, specifications: updatedSpecifications });
    };


    const [openDialog, setOpenDialog] = useState(false);
    const [newSpecName, setNewSpecName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentSpecName, setCurrentSpecName] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const handleAddSpecification = () => {
        setIsEditing(false);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setNewSpecName('');
        setNewSpecValue('');
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

    const handleEditSpecification = (name, value) => {
        setCurrentSpecName(name);
        setNewSpecName(name);
        setNewSpecValue(value);
        setIsEditing(true);
        setOpenDialog(true);
    };

    useEffect(() => {
        if (!imgFiles) return;

        let tmp = [];

        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }
        const objectUrls = tmp;
        setPreviews(objectUrls);

        // Cleanup function để hủy bỏ URL object sau khi không sử dụng nữa
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imgFiles]);

    // Đảm bảo rằng img_arr và uniqueArray được đặt lại đúng cách
    let img_arr = [];
    let uniqueArray = [];

    useEffect(() => {
        window.scrollTo(0, 0)
        setCatData(context.catData)
        setSubCatData(context.subCatData)
    }, [])







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

    const selectCat = (cat) => {
        formFields.catName = cat;
    }



    const onChangeFile = async (e, apiEndPoint) => {
        const files = e.target.files;
        setUploading(true);
        setPreviews([]);

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' ||
                file.type === 'image/png' || file.type === 'image/webp')) {
                formData.append('images', file);
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Please select a valid JPG, PNG, or WEBP image file.'
                });
                setUploading(false);
                return;  // Exits the function early on error
            }
        }

        try {
            await postData(apiEndPoint, formData);
            const response = await fetchDataFromApi("/api/imageUpload");

            if (response && response.length) {
                const newImages = response.map(item => item.images).flat();
                setPreviews(newImages);
            } else {
                setPreviews([]);
            }

            context.setAlertBox({
                open: true,
                error: false,
                msg: "Images Uploaded!"
            });
        } catch (error) {
            console.error('Upload Error:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to upload images.'
            });
        } finally {
            setUploading(false);  // Ensures uploading state is reset
        }
    };

    // Hàm để xóa ảnh khỏi danh sách previews
    const removeImg = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        URL.revokeObjectURL(previews[index]);
    };


    const addProduct = async (e) => {
        e.preventDefault()
        // Reset trạng thái khi bắt đầu một lần tải lên mới
        setPreviews([]);
        setImgFiles([]);

        const appendedArray = [...previews];

        formData.append('name', formFields.name);
        formData.append('description', formFields.description);
        formData.append('brand', formFields.brand);
        formData.append('price', formFields.price);
        formData.append('oldPrice', formFields.oldPrice);
        formData.append('catName', formFields.catName);
        formData.append('category', formFields.category);
        formData.append('subCat', formFields.subCat);
        formData.append('countInStock', formFields.countInStock);
        formData.append('rating', formFields.rating);
        formData.append('isFeatured', formFields.isFeatured);
        formData.append('specifications', JSON.stringify(formFields.specifications));
        formData.append('images', JSON.stringify(appendedArray));


        if (formFields.name !== "" || formFields.color !== "" || previews.length !== 0) {
            setIsLoading(true);
            setIsSelectedFiles(true)

            try {
                await postData(`/api/products/create`, formFields);
                setIsLoading(false);
                await deleteData("/api/imageUpload/deleteAllImages");
                history('/product/list');
            } catch (error) {
                console.error('Error adding product:', error);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Failed to add product.'
                });
            }
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details',
            });
        }




    }

    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Product Upload</h1>

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
                                label="Create"
                            />
                        </Breadcrumbs>
                    </div>
                </div>
            </div>

            <form className='form w-[100%] mt-4' style={{ width: '100%' }} onSubmit={addProduct}>
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
                                        <input type='text' value={formFields.discount} className='input' name='discount' onChange={inputChange} />
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
                                </div>
                            </div>


                            {/* Modal for Adding Specification */}
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

                <div className='card shadow my-4 border-0 flex-center p-3'>
                    <div className='imagesUploadSec'>

                        <h5 className='mb-4 font-weight-bold'>Media And Published</h5>

                        <div className='imgUploadBox d-flex align-items-center'>
                            {
                                previews?.length > 0 && previews.map((img, index) => (
                                    <div className='uploadBox' key={index}>
                                        <span className="remove" onClick={() => removeImg(index, img)}>
                                            <IoCloseSharp />
                                        </span>
                                        <div className='box'>
                                            <img src={img} className="w-100" />
                                        </div>
                                    </div>
                                ))
                            }

                            <div className='uploadBox'>
                                {uploading === true ?
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

export default ProductUpload
