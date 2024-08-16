import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import Rating from '@mui/material/Rating';
import { FaRegImages } from 'react-icons/fa';

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProduct(res);
        });
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div className="product-details container">
            <h1 className="font-weight-bold text-black">{product.name}</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="product-images">
                        {product.images.length > 0 ? (
                            product.images.map((img, index) => (
                                <img key={index} src={`http://localhost:4000/uploads/${img}`} alt={product.name} className="img-fluid" />
                            ))
                        ) : (
                            <div className="no-images">
                                <FaRegImages />
                                <p>No images available</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <h2 className="font-weight-bold">Product Information</h2>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Old Price:</strong> ${product.oldPrice}</p>
                    <p><strong>Stock:</strong> {product.countInStock}</p>
                    <p><strong>Discount:</strong> {product.discount}%</p>
                    <div className="rating">
                        <strong>Rating:</strong>
                        <Rating name="read-only" value={product.rating} readOnly size="small" precision={0.5} />
                    </div>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Sub Category:</strong> {product.subCat}</p>
                    <p><strong>Featured:</strong> {product.isFeatured ? 'Yes' : 'No'}</p>
                    <h3 className="font-weight-bold">Specifications</h3>
                    <table className="table">
                        <tbody>
                            {Object.entries(product.specifications).map(([key, value], index) => (
                                <tr key={index}>
                                    <th>{key}</th>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
