import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "./Components/ProductModal";
import Footer from "./Components/Footer";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { fetchDataFromApi } from "./utils/api";

const MyContext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectCountry, setSelectCountry] = useState("");
  const [isOpenProductModal, setIsOpenProductModal] = useState({
    open:false,
    id:'',
  });

  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);

  useEffect(()=>{

    fetchDataFromApi(`/api/category`).then((res) => {
      setCategoryData(res.categoryList);
    });

    fetchDataFromApi(`/api/subCat`).then((res) => {
      setSubCategoryData(res.subCategoryList);
    });
    
  },[])

  useEffect(() => {
    isOpenProductModal.open===true &&
    fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
      setProductData(res);
    });
  },[isOpenProductModal]);
  
 


  const values = {
    countryList,
    setSelectCountry,
    selectCountry,
    setIsOpenProductModal,
    isOpenProductModal,
    setIsHeaderFooterShow,
    isHeaderFooterShow,
    setIsLogin,
    isLogin,
    categoryData,
    setCategoryData,
    subCategoryData,
    setSubCategoryData,

  };
  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {
          isHeaderFooterShow === true && <Header />
        }

        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/cat/:id" exact={true} element={<Listing />} />
          <Route path="/product/:id" exact={true} element={<ProductDetails />} />
          <Route path="/cart" exact={true} element={<Cart />} />
          <Route path="/signIn" exact={true} element={<SignIn />} />
          <Route path="/signUp" exact={true} element={<SignUp />} />
        </Routes>
        {
          isHeaderFooterShow === true &&     <Footer />
        }
    

        {isOpenProductModal.open === true && <ProductModal data={productData} />}
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export { MyContext };
