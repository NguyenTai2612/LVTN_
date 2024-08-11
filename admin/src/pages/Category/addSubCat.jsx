import React, { useContext, useState } from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { MyContext } from '../../App';
import { Button, CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

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

const addSubCat = () => {
  const [categoryVal, setCategoryVal] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const history = useNavigate()

  const [formFields, setFormFields] = useState({
    category: '',
    subCat: '',
  });
  const context = useContext(MyContext)


  const handleChangeCategory = (event) => {
    setCategoryVal(event.target.value)
    setFormFields(() => ({
      ...formFields,
      category: event.target.value
    }))
  }
  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value
    }))
  }

  const addSubCat = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('category', formFields.category);
    formdata.append('subCat', formFields.subCat);

    if (formFields.category === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please select a category',
      })
      return false
    }

    if (formFields.subCat === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please enter sub category',
      })
      return false
    }


    postData('/api/subCat/create', formFields).then(res => {
      setIsLoading(false)
      history('/subCategory')
  })
  }

  return (
    <div>
      <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
        <div className='flex items-center justify-between'>
          <h1 className='font-weight-bold text-white'>Add Sub Category</h1>

          <div className='ml-auto flex items-center gap-3'>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Sub Category"
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
      <form className='form w-[100%] mt-4' onSubmit={addSubCat} style={{ width: '75%' }}>
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
            <div className='col-md-6 col_'>
              <h4>Sub Category</h4>
              <div className='form-group'>
                <input type='text' value={formFields.subCat} className='input' name='subCat' onChange={inputChange} />
              </div>
            </div>
          </div>
          <Button type="submit" className="btn-blue btn-lg btn-big w-100"

          ><FaCloudUploadAlt /> &nbsp;
            {
              isLoading === true ?
                <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'
            }</Button>



        </div>

      </form>
    </div >
  )
}

export default addSubCat
