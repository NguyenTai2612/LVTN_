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
import { fetchDataFromApi, postData } from "./utils/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";
import Checkout from "./Pages/Checkout";
import Success from "./Pages/Checkout/Success";
import Orders from "./Pages/Orders";

const MyContext = createContext();

function App() {
  const [alertBox, setAlertBox] = React.useState({
    msg: "",
    error: false,
    open: false,
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  const [selectCountry, setSelectCountry] = useState("");
  const [isOpenProductModal, setIsOpenProductModal] = useState({
    open: false,
    id: "",
  });
  const [addingInCart, setAddingInCart] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState("");
  const [cartData, setCartData] = useState();
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

  
  useEffect(() => {
    getCountry("https://provinces.open-api.vn/api/p/");
  }, []);

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    fetchDataFromApi(`/api/category`).then((res) => {
      setCategoryData(res.categoryList);
      // setActiveCat(res.categoryList[0]?.name);
    });

    fetchDataFromApi(`/api/subCat`).then((res) => {
      setSubCategoryData(res.subCategoryList);
    });

    fetchDataFromApi(`/api/cart`).then((res) => {
      setCartData(res);
    });
  }, []);

  const getCartData = () => {
    fetchDataFromApi(`/api/cart`).then((res) => {
      setCartData(res);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== "" && token !== null && token !== undefined) {
      setIsLogin(true);
      console.log(isLogin);
      localStorage.setItem("isLogin", "true");
      const userData = JSON.parse(localStorage.getItem("user"));

      setUser(userData);
    } else {
      setIsLogin(false);
      localStorage.setItem("isLogin", "false");
    }
  }, [isLogin]);

  useEffect(() => {
    isOpenProductModal.open === true &&
      fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
        setProductData(res);
      });
  }, [isOpenProductModal]);

  const addToCat = (data) => {
    setAddingInCart(true);
    postData(`/api/cart/add`, data).then((res) => {
      if (res.status !== false) {
        setAlertBox({
          open: true,
          error: false,
          msg: "Item is added the cart",
        });

        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);
        getCartData();
      } else {
        setAlertBox({
          open: true,
          error: true,
          msg: res.msg,
        });
        setAddingInCart(false);
      }
    });
  };

  const values = {
    countryList,
    setCountryList,
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
    activeCat,
    setActiveCat,
    setAlertBox,
    alertBox,
    addToCat,
    setAddingInCart,
    addingInCart,
    setCartData,
    cartData,
    getCartData,
  };
  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Snackbar
          open={alertBox.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>
        {isHeaderFooterShow === true && <Header />}

        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/subCat/:id" exact={true} element={<Listing />} />
          <Route
            path="/products/category/:id"
            exact={true}
            element={<Listing />}
          />
          <Route
            path="/product/:id"
            exact={true}
            element={<ProductDetails />}
          />
          <Route path="/cart" exact={true} element={<Cart />} />
          <Route path="/checkout-success" exact={true} element={<Success />} />
          <Route path="/signIn" exact={true} element={<SignIn />} />
          <Route path="/signUp" exact={true} element={<SignUp />} />
          <Route path="/checkout" exact={true} element={<Checkout />} />
          <Route path="/orders" exact={true} element={<Orders />} />
        </Routes>
        {isHeaderFooterShow === true && <Footer />}

        {isOpenProductModal.open === true && (
          <ProductModal data={productData} />
        )}
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export { MyContext };
