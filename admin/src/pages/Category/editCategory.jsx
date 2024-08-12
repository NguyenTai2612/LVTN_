import React, { useContext, useEffect, useState } from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt, FaRegImages } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchDataFromApi, postData } from '../../utils/api';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light'
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

const EditCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [imgFiles, setImgFiles] = useState([]);
  const [formFields, setFormFields] = useState({
    name: '',
    subCat: '',
    images: [],
    color: ''
  });

  const { id } = useParams();
  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    context.setProgress(20);
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      setFormFields({
        name: res.name,
        subCat: res.subCat,
        color: res.color
      });
      setPreviews(res.images);
      context.setProgress(100);
    });
  }, [id]);

  useEffect(() => {
    if (!imgFiles.length) return;

    const objectUrls = imgFiles.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imgFiles]);

  const onChangeFile = async (e, apiEndPoint) => {
    const files = e.target.files;
    setUploading(true);

    const formData = new FormData();
    const validImages = Array.from(files).filter(file =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (validImages.length !== files.length) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please select a valid JPG or PNG image file.',
      });
      setUploading(false);
      return;
    }

    validImages.forEach(file => formData.append('images', file));

    try {
      await postData(apiEndPoint, formData);
      setImgFiles(validImages);
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'Images uploaded successfully!',
      });
    } catch (error) {
      console.error('Upload Error:', error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Failed to upload images.',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImg = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    URL.revokeObjectURL(previews[index]);
  };

  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const editCategory = async (e) => {
    e.preventDefault();
    
    const updatedData = new FormData();
    updatedData.append('name', formFields.name);
    updatedData.append('subCat', formFields.subCat);
    updatedData.append('color', formFields.color);
    if (imgFiles) {
        for (const file of imgFiles) {
            updatedData.append('images', file);
        }
    }

    try {
        setIsLoading(true);
        const response = await axios.put(`http://localhost:4000/api/category/${id}`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            context.setAlertBox({
                open: true,
                msg: 'Category updated successfully!',
                error: false
            });
            history('/category');
        }
    } catch (error) {
        console.error(error);
        context.setAlertBox({
            open: true,
            error: true,
            msg: 'Failed to update category',
        });
    } finally {
        setIsLoading(false);
    }
}


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                label="Edit Category"
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
                  previews.length > 0 && previews.map((img, index) => (
                    <div className='uploadBox' key={index}>
                      <span className="remove" onClick={() => removeImg(index)}>
                        <IoCloseSharp />
                      </span>
                      <div className='box'>
                        <img src={img} className="w-100" alt="Category Preview" />
                      </div>
                    </div>
                  ))
                }

                <div className='uploadBox'>
                  {uploading ?
                    <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                      <CircularProgress />
                      <span>Uploading...</span>
                    </div>
                    :
                    <>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => onChangeFile(e, '/api/category/upload')}
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

            <Button type="submit" className="btn-blue btn-lg btn-big w-100">
              <FaCloudUploadAlt /> &nbsp;
              {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
            </Button>
          </div>
        </div>
      </form>
      <br />
      <br />
      <br />
    </>
  );
};

export default EditCategory;
