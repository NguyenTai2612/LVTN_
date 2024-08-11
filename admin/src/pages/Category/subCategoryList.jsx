import React, { useContext, useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TooltipBox from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';

import Checkbox from '@mui/material/Checkbox';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

import 'swiper/css';
import 'swiper/css/navigation';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';


import { Link } from 'react-router-dom';
import { MyContext } from '../../App';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
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

const subCategoryList = () => {

    const [isAllChecked, setIsAllChecked] = useState(false);
    const [open, setOpen] = React.useState(false);
    
    const [subCatData, setSubCatData] = useState([]);

    const context = useContext(MyContext)



    // const handleChange = (event) => {
    //     setPerPage(event.target.value);
    //     setShowBy(event.target.value)
    // };

    const selectAll = (e) => {
        if (e.target.checked === true) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        context.setProgress(20)

        fetchDataFromApi('/api/subCat').then((res) => {
            setSubCatData(res)
            console.log(res)
            context.setProgress(100)

        })
    }, [])


  
    const handleClickOpen = () => {
        setOpen(true);
    };






    const deleteCat = (id) => {

        deleteData(`/api/subCat/${id}`).then(res => {
            fetchDataFromApi('/api/subCat').then((res) => {
                setSubCatData(res)
            })
        })
    }

    const handleChange = (event, value) => {
        context.setProgress(40)

        fetchDataFromApi(`/api/subCat?page=${value}`).then((res) => {
            setSubCatData(res);
            context.setProgress(100)

        })
    };

    return (
        <>

            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Sub Category List</h1>


                    <div className='ml-auto flex align-items-center gap-3'>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Sub Category"

                            />
                        </Breadcrumbs>
                        <Link to={'/subCategory/add'}> <Button className='btn-blue ml-3 p-5 pr-5'>Add Sub Category</Button></Link>

                    </div>
                </div>
            </div>
            <div className='card shadow my-4 border-0'>
                <div className='flex items-center mb-4 justify-between pt-3 px-4'>



                </div>
                <div className='table-responsive mb-2'>
                    <table className='table w-[100%] table-striped'>
                        <thead className='thead-dark'>
                            <tr>
                                <th><Checkbox {...label} size='small' onChange={selectAll} /></th>
                                <th>CATEGORY IMAGE</th>
                                <th>CATEGORY</th>
                                <th>SUB CATEGORY</th>
                                <th>ACTIONS</th>

                            </tr>
                        </thead>

                        <tbody>
                            {
                                subCatData?.subCategoryList?.length !== 0 && subCatData?.subCategoryList?.map((item, index) => {
                                    return (
                                        <tr>
                                            <td><Checkbox {...label} size='small' checked={isAllChecked} /><span>#{index + 1}</span></td>
                                            <td>
                                                <div className='flex items-center gap-5 w-[200px]'>
                                                    <div className='imgWrapper shadow overflow-hidden w-[25%] h-[25%] rounded-md'>
                                                        <img src={`${context.baseUrl}/uploads/${item.category.images[0]}`} className='w-100' />
                                                    </div>

                                                </div>

                                            </td>
                                            <td>{item.category.name}</td>
                                            <td>{item.subCat}</td>

                                            <td>
                                                <div className='actions flex items-center gap-2'>
                                                    <TooltipBox title="Edit" placement="top">
                                                        <Link to={`/subCategory/edit/${item.id}`}>
                                                            <button
                                                                className='edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'                                                            
                                                            ><FiEdit3 />
                                                            </button>
                                                        </Link>
                                                    </TooltipBox>

                                                    <TooltipBox title="Delete" placement="top">
                                                        <button
                                                            className='delete-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'
                                                            onClick={() => deleteCat(item.id)}
                                                        ><MdOutlineDeleteOutline /></button>
                                                    </TooltipBox>
                                                </div>

                                            </td>
                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </table>
                </div>
                <div className='table-footer flex items-center justify-between py-2 px-3 mb-2'>

                    {/* <div className='flex items-center gap-3'>
                        <h6 className='mb-0 text-sm'>Rows per page</h6>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={perPage}
                            label="Page"
                            onChange={handleChange}
                            size='small'
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </div> */}
                    {
                        subCatData?.totalPages > 1 &&
                        <div className="d-flex tableFooter flex items-center justify-end py-2 px-3 mb-2 ml-auto">
                            <Pagination count={subCatData?.totalPages} color="primary" className="pagination"
                                showFirstButton showLastButton onChange={handleChange} />
                        </div>
                    }




                </div>

            </div>



        </>
    )
}

export default subCategoryList
