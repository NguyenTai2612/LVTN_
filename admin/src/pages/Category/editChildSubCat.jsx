import React, { useContext, useState, useEffect } from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { MyContext } from '../../App';
import { Button, CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiGetChildSubCategoryById, apiUpdateChildSubCategory } from '../../services/childSubCategory'; // Update the service imports
import { apiGetAllSubCategories } from '../../services/subCategory';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
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

const EditChildSubCategory = () => {
  const { id } = useParams(); // Get ID from route params
  const [categoryVal, setCategoryVal] = useState('');
  const [subCat, setSubCat] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const result = await apiGetAllSubCategories();
        setSubCategories(result);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    };

    const fetchChildSubCategory = async () => {
      try {
        const result = await apiGetChildSubCategoryById(id);
        if (result.err === 0) {
          const { sub_category_id, name } = result.response;
          setCategoryVal(sub_category_id); // Set the current category ID
          setSubCat(name); // Set the current child subcategory name
        }
      } catch (error) {
        console.error('Failed to fetch child subcategory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories().then(() => {
      fetchChildSubCategory();
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
        sub_category_id: categoryVal,
        name: subCat
      };
      const response = await apiUpdateChildSubCategory(id, data);
      if (response.err === 0) {
        navigate('/childSubCat'); // Ensure correct navigation
      } else {
        alert('Failed to update child subcategory');
      }
    } catch (error) {
      console.error('Failed to update child subcategory:', error);
      alert('Failed to update child subcategory');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
        <div className='flex items-center justify-between'>
          <h1 className='font-weight-bold text-white'>Edit Child Sub Category</h1>
          <div className='ml-auto flex items-center gap-3'>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb component={Link} to="/" label="Dashboard" icon={<HomeIcon fontSize="small" />} />
              <StyledBreadcrumb component={Link} to='/childSubCategory' label="Child Sub Category" />
              <StyledBreadcrumb label="Edit Child Sub Category" />
            </Breadcrumbs>
          </div>
        </div>
      </div>
      <form className='form w-[100%] mt-4' onSubmit={handleSubmit} style={{ width: '75%' }}>
        <div className='card shadow my-4 border-0 flex-center p-3'>
          <div className='row'>
            <div className='col-md-6'>
              <h4>Sub Category</h4>
              <div className='form-group'>
                <FormControl size="small" className="w-100">
                  <Select
                    value={categoryVal}
                    onChange={handleChangeCategory}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    labelId="demo-select-small-label"
                    className="w-100"
                    name='subCategory'
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {subCategories.map((cat) => (
                      <MenuItem className='text-capitalize' value={cat.id} key={cat.id}>
                        {cat.subCat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className='col-md-6'>
              <h4>Child Sub Category Name</h4>
              <div className='form-group'>
                <input
                  type='text'
                  value={subCat}
                  className='input'
                  name='subCat'
                  onChange={inputChange}
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="btn-blue btn-lg btn-big w-100">
            <FaCloudUploadAlt /> &nbsp;
            {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'UPDATE AND VIEW'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditChildSubCategory;
