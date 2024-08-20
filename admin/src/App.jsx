
import React, { useEffect, useRef } from 'react'
import { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
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
import Login from './pages/Login/Login.jsx'

const MyContext = createContext()

function App() {
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);

  const [isLogin, setIsLogin] = useState(false);
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: ""
  });


  const [progress, setProgress] = useState(0)
  const [baseUrl, setBaseUrl] = useState("http://localhost:4000")
  const [alertBox, setAlertBox] = React.useState({
    msg: '',
    error: false,
    open: false
  });

  useEffect(() => {
    setProgress(20)
    fetchCategory()
    fetchSubCategory()
  }, [])


  const fetchCategory = () => {
    fetchDataFromApi('/api/category').then((res) => {
      setCatData(res)

      setProgress(100)
    })
  }

  const fetchSubCategory = () => {
    fetchDataFromApi('/api/subCat').then((res) => {
      setSubCatData(res)


      setProgress(100)
    })
  }

  const values = {
    setAlertBox,
    alertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    fetchSubCategory,
    subCatData,
    isLogin,
    setIsLogin,
    isHeaderFooterShow,
    setIsHeaderFooterShow,
    setUser,
    user,
    setIsLogin,
    isLogin,
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if(token!=="" && token!==null && token!==undefined){
      setIsLogin(true)

      const userData = JSON.parse(localStorage.getItem("user"))
      

      setUser(userData)

    }else{
      setIsLogin(false)
    }

  },[isLogin])


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
                <Route path='/' exact={true} element={<Dashboard />} />
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
                <Route path='/signUp' exact={true} element={<SignUp />} />
                <Route path='/login' exact={true} element={<Login />} />



              </Routes>
            </div>
          </section>

        </MyContext.Provider>
      </BrowserRouter>


    </>
  )
}


export default App
export { MyContext };