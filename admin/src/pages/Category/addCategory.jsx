import React, { useContext, useEffect, useState } from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { FaRegImages } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";

import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App'


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

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [files, setFiles] = useState([])
    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState([]);



    const history = useNavigate()

    const context = useContext(MyContext)

    

    // Đảm bảo rằng img_arr và uniqueArray được đặt lại đúng cách
    let img_arr = [];
    let uniqueArray = [];

    const onChangeFile = async () => {
       
    };





    // Hàm để xóa ảnh khỏi danh sách previews
    const removeImg = (index) => {
        
    };



    const changeInput = (e) => {
        
    }




    const addCategory = async (e) => {
       
    };


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Add Category</h1>

                    <div className='ml-auto flex items-center gap-3'>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small"
                                />}
                            />
                            <StyledBreadcrumb component={Link} href="#" label="Category" to='http://localhost:5173/category' />
                            <StyledBreadcrumb
                                label="Add Category"
                            />
                        </Breadcrumbs>
                    </div>
                </div>
            </div>

            <form className='form w-[100%] mt-4' onSubmit={addCategory} style={{ width: '75%' }}>
                <div className='card shadow my-4 border-0 flex-center p-3'>

                    <div className='row'>

                        <div className='col-md-12 col_'>

                            <h4>Category Name</h4>
                            <div className='form-group'>
                                <input type='text' className='input' name='name' onChange={changeInput} />
                            </div>
                        </div>





                       

                        <div className='col-md-12 col_'>
                            <h5 className='mb-4 font-weight-bold'>Media And Published</h5>

                            <div className='imgUploadBox d-flex align-items-center'>
                                {
                                    length > 0 && map((img, index) => (
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

            </form >
            <br />
            <br />
            <br />
        </>
    )
}

export default AddCategory
