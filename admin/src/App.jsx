
import React, { useEffect, useRef } from 'react'
import { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard/ProductStatistics.jsx'
import Header from './components/Header'
import ProductList from './pages/Products/productList'
import CategoryAdd from './pages/Category/addCategory.jsx'
import CategoryList from './pages/Category/categoryList.jsx'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar'
import ProductUpload from './pages/Products/addProduct.jsx'
import EditCategory from './pages/Category/editCategory.jsx'
import EditProduct from './pages/Products/editProduct.jsx'
import { fetchDataFromApi } from './utils/api.js'
import SubCatAdd from './pages/Category/addSubCat.jsx'
import SubCatList from './pages/Category/subCategoryList.jsx'
import EditSubCategory from './pages/Category/editSubCat.jsx'
import ProductDetails from './pages/Products/productDetails.jsx'
import SignUp from './pages/SignUp/index.jsx'
import Orders from './pages/Orders/orderList.jsx'
import Pending from './pages/Orders/Pending.jsx'
import Confirmed from './pages/Orders/Confirmed.jsx'
import Shipping from './pages/Orders/Shipping.jsx'
import Completed from './pages/Orders/Completed.jsx'
import Cancelled from './pages/Orders/Cancelled.jsx'

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import reduxStore from "./redux";
import BrandList from './pages/Brand/brandList.jsx'
import AddBrand from './pages/Brand/addBrand.jsx'
import EditBrand from './pages/Brand/editBrand.jsx'
import UserList from './pages/User/userList.jsx'
import EditUser from './pages/User/editUser.jsx'
import OrderDetails from './pages/Orders/OrderDetails.jsx'
import ProductStatistics from './pages/Dashboard/ProductStatistics.jsx'
import Revenue from './pages/Dashboard/Revenue.jsx'
import Overview from './pages/Dashboard/Overview.jsx'
import ChildSubCategoryList from './pages/Category/ChildSubCatList.jsx'
import AddChildSubCategory from './pages/Category/addChildSubCat.jsx'
import EditChildSubCategory from './pages/Category/editChildSubCat.jsx'

const { store, persistor } = reduxStore();

const MyContext = createContext()

function App() {
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);

  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: ""
  });


  const [progress, setProgress] = useState(0)
  const [alertBox, setAlertBox] = React.useState({
    msg: '',
    error: false,
    open: false
  });





  const values = {
    setAlertBox,
    alertBox,
    setProgress,
    catData,
    // fetchCategory,
    // fetchSubCategory,
    subCatData,
    isHeaderFooterShow,
    setIsHeaderFooterShow,
    setUser,
    user,
  }




  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <MyContext.Provider value={values}>

              <LoadingBar
                className='topLoadingBar'
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
              />
              <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity={alertBox.error === false ? "success" : "error"}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {
                    alertBox.msg
                  }
                </Alert>
              </Snackbar>
              <section className='main flex'>
                {
                  isHeaderFooterShow === false &&
                  (<div className='sidebarWrapper w-[17%]'>
                    <Sidebar />
                  </div>)
                }


                <div className={`w-[83%] px-4 ${isHeaderFooterShow ? '' : 'content_Right'}`}>
                  {
                    isHeaderFooterShow === false &&
                    <>
                      <Header />
                      <div className='space'></div>
                    </>
                  }
                  <Routes>
                    <Route path='/' exact={true} element={<Overview />} />
                    <Route path='/product_statistics' exact={true} element={<ProductStatistics />} />
                    <Route path='/revenue' exact={true} element={<Revenue />} />
                    
                    <Route path='/product/list' exact={true} element={<ProductList />} />
                    <Route path='/product/upload' exact={true} element={<ProductUpload />} />
                    <Route path='/product/detail/:id' exact={true} element={<ProductDetails />} />
                    <Route path='/product/edit/:id' exact={true} element={<EditProduct />} />
                    <Route path='/category' exact={true} element={<CategoryList />} />
                    <Route path='/category/add' exact={true} element={<CategoryAdd />} />
                    <Route path='/category/edit/:id' exact={true} element={<EditCategory />} />

                    <Route path='/subCategory' exact={true} element={<SubCatList />} />
                    <Route path='/subCategory/add' exact={true} element={<SubCatAdd />} />
                    <Route path='/subCategory/edit/:id' exact={true} element={<EditSubCategory />} />

                    <Route path='/childSubCat' exact={true} element={<ChildSubCategoryList />} />
                    <Route path='/childSubCat/add' exact={true} element={<AddChildSubCategory />} />
                    <Route path='/childSubCat/edit/:id' exact={true} element={<EditChildSubCategory />} />

                    <Route path='/signUp' exact={true} element={<SignUp />} />
                    <Route path='/orders' exact={true} element={<Orders />} />
                    <Route path='/pending' exact={true} element={<Pending />} />
                    <Route path='/confirmed' exact={true} element={<Confirmed />} />
                    <Route path='/shipping' exact={true} element={<Shipping />} />
                    <Route path='/completed' exact={true} element={<Completed />} />
                    <Route path='/cancelled' exact={true} element={<Cancelled />} />
                    <Route path="/order-details/:id" element={<OrderDetails />} />

                    <Route path='/brand' exact={true} element={<BrandList />} />
                    <Route path='/brand/add' exact={true} element={<AddBrand />} />
                    <Route path='/brand/edit/:id' exact={true} element={<EditBrand />} />

                    <Route path='/user/list' exact={true} element={<UserList />} />
                    <Route path='/user/edit/:id' exact={true} element={<EditUser />} />

                  </Routes>
                </div>
              </section>

            </MyContext.Provider>
          </BrowserRouter>
        </PersistGate>
      </Provider>

    </>
  )
}


export default App
export { MyContext };