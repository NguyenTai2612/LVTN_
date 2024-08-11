import React, { useContext, useEffect, useState } from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { FaRegImages } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";

import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";
import { fetchDataFromApi, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

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
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const EditCategory = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSelectedImages, setIsSelectedImages] = useState(false)
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);

    const [files, setFiles] = useState([])
    const [category, setcategory] = useState([])
    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState();

    let { id } = useParams()

    const [formFields, setFormFields] = useState({
        name: '',
        subCat:'',
        images: [],
        color: ''
    });

    const formdata = new FormData()
    const history = useNavigate()

    const context = useContext(MyContext)

   
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
        context.setProgress(20);
        fetchDataFromApi(`/api/category/${id}`).then((res) => {
            setcategory(res);
            setFormFields({
                name: res.name,
                subCat: res.subCat,
                color: res.color
            });
            setPreviews(res.images);
            context.setProgress(100);
        });

    }, []);


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
                setIsSelectedImages(true)
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


    const changeInput = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    }



    const editCategory = (e) => {
        e.preventDefault();
        
        formdata.append('name', formFields.name);
        formdata.append('subCat', formFields.subCat);
        formdata.append('color', formFields.color);
    
        if (formFields.name !== "" && formFields.color !== "" && formFields.subCat !== "") {
            setIsLoading(true);
            
            axios.put(`http://localhost:4000/api/category/${id}`, formFields)
            .then(res => {
                context.setAlertBox({
                    open: true,
                    msg: 'Category is update success!',
                    error: false
                })
                setIsLoading(false);
                history('/category');
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Failed to update category',
                });
            });
        
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details',
            });
            return false;
        }
    }
    
    

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Edit Category</h1>

                    <div className='ml-auto flex items-center gap-3'>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component="a" href="#" label="Category" />
                            <StyledBreadcrumb
                                label="Add Category"
                            />
                        </Breadcrumbs>
                    </div>
                </div>
            </div>

            <form className='form w-[100%] mt-4' onSubmit={editCategory} style={{ width: '75%' }}>
                <div className='card shadow my-4 border-0 flex-center p-3'>

                    <div className='row'>

                        <div className='col-md-12 col_'>

                            <h4>Category Name</h4>
                            <div className='form-group'>
                                <input type='text' className='input' name='name' value={formFields.name} onChange={changeInput} />
                            </div>
                        </div>

                        {/* <div className='col-md-12 col_'>

                            <h4>Sub Category</h4>
                            <div className='form-group'>
                                <input type='text' className='input' name='subCat' value={formFields.subCat} onChange={changeInput} />
                            </div>
                        </div> */}



                        <div className='col-md-12 col_'>
                            <h4>Color</h4>
                            <div className='form-group'>
                                <input type='text' className='input' name='color' value={formFields.color} onChange={changeInput} />
                            </div>
                        </div>

                        <div className='col-md-12 col_'>
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
                                        (e, '/api/category/upload')} name="images" />
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
                </div>
            </form >
            <br />
            <br />
            <br />
        </>
    )
}

export default EditCategory
