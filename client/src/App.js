import React from "react";
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
import Checkout from "./Pages/Checkout";
import SuccessPage from "./Pages/Checkout/SuccessPage";
import Orders from "./Pages/Orders";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import reduxStore from "./redux";
import { getCartItems } from "./services/cart";
import SearchPage from "./Components/Header/SearchPage";

const { store, persistor } = reduxStore();

const MyContext = createContext();

function App({ children }) {
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
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      if (userId) {
        const items = await getCartItems(userId);
        setCartData(items);
      }
    };
    fetchCartData();
  }, []);

  const getCartData = () => {
    fetchDataFromApi(`/api/cart`).then((res) => {
      setCartData(res);
    });
  };

  useEffect(() => {
    isOpenProductModal.open === true &&
      fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
        setProductData(res);
      });
  }, [isOpenProductModal]);

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
    setAddingInCart,
    addingInCart,
    setCartData,
    cartData,
    getCartData,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
            {isHeaderFooterShow && <Header />}

            <Routes>
              <Route path="/" exact={true} element={<Home />} />
              <Route
                path="/product/category/:id"
                exact={true}
                element={<Listing type="category" />} // Truyền giá trị type cho Listing
              />
              <Route
                path="/listing/subcategory/:id"
                exact={true}
                element={<Listing type="subcategory" />} // Truyền giá trị type cho Listing
              />
              <Route
                path="/listing/childsubcategory/:id"
                exact={true}
                element={<Listing type="childsubcategory" />} // Truyền giá trị type cho Listing
              />

              <Route path="/search" element={<SearchPage />} />

              <Route
                path="/product/:id"
                exact={true}
                element={<ProductDetails />}
              />
              <Route path="/cart" exact={true} element={<Cart />} />

              <Route path="/signIn" exact={true} element={<SignIn />} />
              <Route path="/signUp" exact={true} element={<SignUp />} />
              <Route path="/checkout" exact={true} element={<Checkout />} />
              <Route path="/orders" exact={true} element={<Orders />} />
              <Route path="/success" exact={true} element={<SuccessPage />} />
            </Routes>
            {isHeaderFooterShow && <Footer />}

            {isOpenProductModal.open === true && (
              <ProductModal data={productData} />
            )}
          </MyContext.Provider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
export { MyContext };
