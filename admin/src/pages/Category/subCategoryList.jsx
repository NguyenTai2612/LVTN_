import React, { useEffect, useState, useContext } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TooltipBox from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { apiDeleteSubCategory, apiGetSubCategories } from '../../services/subCategory';
import { apiGetCategories } from '../../services/category';

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
});

const SubCategoryList = () => {
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [subCatData, setSubCatData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const context = useContext(MyContext);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const fetchData = async (page) => {
        try {
            const result = await apiGetSubCategories(page, 3);
            console.log('Fetched Data:', result);

            setSubCatData(result.data || []);
            setTotalPages(result.totalPages || 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (event, page) => {
        console.log('Page changed to:', page);
        setCurrentPage(page);
    };

    const selectAll = (e) => {
        setIsAllChecked(e.target.checked);
    };

    const deleteCat = async (id) => {
        try {
            const result = await apiDeleteSubCategory(id);
            console.log('Delete response:', result); // Log result to verify
    
            if (result.err === 0) {
                await fetchData(currentPage); // Reload the current page’s data
            } else {
                alert('Failed to delete subcategory');
            }
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };
    
    
    
    
    
    
    
    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Sub Category List</h1>
                    <div className='ml-auto flex align-items-center gap-3'>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb label="Sub Category" />
                        </Breadcrumbs>
                        <Link to='/subCategory/add'>
                            <Button className='btn-blue ml-3 p-5 pr-5'>Add Sub Category</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='card shadow my-4 border-0'>
                <div className='flex items-center mb-4 justify-between pt-3 px-4'></div>
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
                            {subCatData.length > 0 ? subCatData.map((item, index) => {
                                const category = item.Category;
                                return (
                                    <tr key={item.id || index}>
                                        <td>
                                            <Checkbox {...label} size='small' checked={isAllChecked} />
                                            <span>#{index + 1}</span>
                                        </td>
                                        <td>
                                            <div className='flex items-center gap-5 w-[200px]'>
                                                {category?.image && (
                                                    <div className='imgWrapper shadow overflow-hidden w-[25%] h-[25%] rounded-md'>
                                                        <img src={category.image} className='w-100' alt="category" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{category?.name}</td>
                                        <td>{item.subCat}</td>
                                        <td>
                                            <div className='actions flex items-center gap-2'>
                                                <TooltipBox title="Edit" placement="top">
                                                    <Link to={`/subCategory/edit/${item.id}`}>
                                                        <button className='edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'>
                                                            <FiEdit3 />
                                                        </button>
                                                    </Link>
                                                </TooltipBox>
                                                <TooltipBox title="Delete" placement="top">
                                                    <button className='delete-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300' onClick={() => deleteCat(item.id)}>
                                                        <MdOutlineDeleteOutline />
                                                    </button>
                                                </TooltipBox>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5">No sub-categories available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>




                <div className="table-footer flex items-center justify-between py-2 px-3 mb-2">
                    {totalPages > 1 &&
                        <div className="d-flex tableFooter flex items-center justify-end py-2 px-3 mb-2 ml-auto">
                            <Pagination
                                count={totalPages}
                                color="primary"
                                className="pagination"
                                page={currentPage}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default SubCategoryList;
