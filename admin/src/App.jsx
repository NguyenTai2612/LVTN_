
import React, { useRef } from 'react'
import { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import ProductList from './pages/Products/productList'
import CategoryAdd from './pages/CategoryList/addCategory.jsx'
import CategoryList from './pages/CategoryList'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar'
import ProductUpload from './pages/Products/addProduct.jsx'
import EditCategory from './pages/CategoryList/editCategory.jsx'
import EditProduct from './pages/Products/editProduct.jsx'

const MyContext = createContext()

function App() {
  const [progress, setProgress] = useState(0)
  const [baseUrl, setBaseUrl] = useState("http://localhost:4000")
  const [alertBox, setAlertBox] = React.useState({
    msg: '',
    error: false,
    open: false
  });
  const values = {
    setAlertBox,
    alertBox,
    setProgress,
    baseUrl
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
              severity={alertBox.error===false ? "success" : "error"}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {
                alertBox.msg
              }
            </Alert>
          </Snackbar>
          <section className='main flex'>
            <div className='sidebarWrapper w-[17%]'>
              <Sidebar />
            </div>

            <div className='content_Right w-[83%] px-4' style={{background:'silver'}}>
              <Header />
              <div className='space'></div>
              <Routes>
                <Route path='/' exact={true} element={<Dashboard />} />
                <Route path='/product/list' exact={true} element={<ProductList />} />
                <Route path='/product/upload' exact={true} element={<ProductUpload />} />
                <Route path='/product/edit/:id' exact={true} element={<EditProduct />} />
                <Route path='/category' exact={true} element={<CategoryList />} />
                <Route path='/category/add' exact={true} element={<CategoryAdd />} />
                <Route path='/category/edit/:id' exact={true} element={<EditCategory />} />

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