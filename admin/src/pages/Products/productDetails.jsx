import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';

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

const ProductDetail = () => {
    const { id } = useParams();
    const context = useContext(MyContext);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        context.setProgress(40);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProduct(res);
            context.setProgress(100);
        });
    }, [id]);

    const deleteProduct = () => {
        context.setProgress(40);
        deleteData(`/api/products/${id}`).then((res) => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted!'
            });
            // redirect to product list or homepage
        });
    };

    if (!product) return null;

    return (
        <div className="container mx-auto p-4">
            <div className="card shadow-lg rounded-lg p-4 mb-4" style={{ backgroundColor: '#343A40' }}>
                <div className="flex justify-between items-center">
                    <h1 className="text-white font-bold">{product.name}</h1>
                    <Breadcrumbs aria-label="breadcrumb">
                        <StyledBreadcrumb
                            component={Link}
                            href="#"
                            label="Dashboard"
                            to="/"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb component={Link} href="#" label="Product List" to='/product/list' />
                        <StyledBreadcrumb label={product.name} />
                    </Breadcrumbs>
                </div>
            </div>

            <div className="card shadow-lg rounded-lg p-4">
                <div className="flex flex-wrap justify-between mb-4">
                    <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
                        <div className="mb-2">
                            <h4 className="font-semibold">Category</h4>
                            <p>{product.category.name}</p>
                        </div>
                        <div className="mb-2">
                            <h4 className="font-semibold">Sub Category</h4>
                            <p>{product.subCat.subCat}</p>
                        </div>
                        <div className="mb-2">
                            <h4 className="font-semibold">Brand</h4>
                            <p>{product.brand}</p>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
                        <div className="imgWrapper shadow-lg overflow-hidden rounded-md h-64">
                            <img
                                src={`${context.baseUrl}/uploads/${product.images[0]}`}
                                className="w-full h-full object-cover"
                                alt={product.name}
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <h6 className="font-bold text-lg mb-2">{product.name}</h6>
                        <p className="mb-2">{product.description}</p>
                        <p className="mb-2"><strong>Price:</strong> {product.price} VND</p>
                        <p className="mb-2"><strong>Stock:</strong> {product.stock}</p>
                        <Rating name="size-small" defaultValue={product.rating} precision={0.5} readOnly size='small' />
                    </div>
                </div>

                <div className="flex justify-start gap-2 mt-4">
                    <Button variant="contained" color="secondary" onClick={() => deleteProduct(product.id)}>
                        <MdOutlineDeleteOutline /> Delete Product
                    </Button>
                    <Link to={`/product/edit/${product.id}`}>
                        <Button variant="outlined" color="primary">
                            <FiEdit3 /> Edit Product
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
