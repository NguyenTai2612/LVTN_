import React, { useContext, useState, useEffect } from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { MyContext } from '../../App';
import { Button, CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiGetSubCategoryById, apiUpdateSubCategory } from '../../services/subCategory';
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

const EditSubCategory = () => {
  const { id } = useParams(); // Get ID from route params
  const [categoryVal, setCategoryVal] = useState('');
  const [subCat, setSubCat] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubCatLoading, setIsSubCatLoading] = useState(true);
  const navigate = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    // Fetch categories and subcategory
    const fetchCategories = async () => {
      try {
        const result = await apiGetAllCategories();
        console.log('Fetched categories:', result); // Debugging
        setCategories(result);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchSubCategory = async () => {
      try {
        const result = await apiGetSubCategoryById(id);
        if (result.err === 0) {
          const { category_id, subCat } = result.response;
          setCategoryVal(category_id);  // Update state with current category ID
          setSubCat(subCat);
        }
      } catch (error) {
        console.error('Failed to fetch subcategory:', error);
      } finally {
        setIsSubCatLoading(false);
      }
    };

    fetchCategories().then(() => {
      fetchSubCategory().finally(() => setIsLoading(false));
    });
  }, [id]);

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
        category_id: categoryVal,  // category ID
        subCat                     // sub-category name
      };
  
      // Call the API, passing the ID and the data object
      const response = await apiUpdateSubCategory(id, data); // Pass id separately
  
      if (response.err === 0) {
        navigate('/subCategory');
      } else {
        alert('Failed to update subcategory');
      }
    } catch (error) {
      console.error('Failed to update subcategory:', error);
      alert('Failed to update subcategory');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading || isSubCatLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
        <div className='flex items-center justify-between'>
          <h1 className='font-weight-bold text-white'>Edit Sub Category</h1>
          <div className='ml-auto flex items-center gap-3'>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component={Link}
                to="/"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb component={Link} to='/subCategory' label="Sub Category" />
              <StyledBreadcrumb label="Edit Sub Category" />
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
                    disabled={isLoading}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {categories.map((cat) => (
                      <MenuItem className='text-capitalize' value={cat.id} key={cat.id}>
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
          <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={isLoading}>
            <FaCloudUploadAlt /> &nbsp;
            {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'UPDATE AND VIEW'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSubCategory;
