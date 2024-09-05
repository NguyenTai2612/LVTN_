import React, { useContext, useState, useEffect } from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { MyContext } from '../../App';
import { Button, CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { apiCreateSubCategory } from '../../services/subCategory'; // Import các dịch vụ API cần thiết
import { apiGetAllCategories } from '../../services/category';

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

const AddSubCategory = () => {
  const [categoryVal, setCategoryVal] = useState('');
  const [subCat, setSubCat] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    // Lấy danh sách danh mục khi component được mount
    const fetchCategories = async () => {
      try {
        const result = await apiGetAllCategories();
        setCategories(result);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChangeCategory = (event) => {
    setCategoryVal(event.target.value);
  };

  const inputChange = (e) => {
    setSubCat(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        category_id: categoryVal,
        subCat
      };
      const response = await apiCreateSubCategory(data);
      if (response.err === 0) {
        // Redirect to subcategory list or show a success message
        navigate('/subCategory');
      } else {
        alert('Failed to create subcategory');
      }
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      alert('Failed to add subcategory');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
        <div className='flex items-center justify-between'>
          <h1 className='font-weight-bold text-white'>Add Sub Category</h1>
          <div className='ml-auto flex items-center gap-3'>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component={Link}
                to="/"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb component={Link} to='/subCategory' label="Sub Category" />
              <StyledBreadcrumb label="Add Sub Category" />
            </Breadcrumbs>
          </div>
        </div>
      </div>
      <form className='form w-[100%] mt-4' onSubmit={handleSubmit} style={{ width: '75%' }}>
        <div className='card shadow my-4 border-0 flex-center p-3'>
          <div className='row'>
            <div className='col-md-6 col_'>
              <h4>Category</h4>
              <div className='form-group'>
                <FormControl size="small" className="w-100">
                  <Select
                    value={categoryVal}
                    onChange={handleChangeCategory}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    labelId="demo-select-small-label"
                    className="w-100"
                    name='category'
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {categories.map((cat, index) => (
                      <MenuItem className='text-capitalize' value={cat.id} key={index}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className='col-md-6 col_'>
              <h4>Sub Category</h4>
              <div className='form-group'>
                <input type='text' value={subCat} className='input' name='subCat' onChange={inputChange} />
              </div>
            </div>
          </div>
          <Button type="submit" className="btn-blue btn-lg btn-big w-100">
            <FaCloudUploadAlt /> &nbsp;
            {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategory;
